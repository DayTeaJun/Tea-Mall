"use client";

import { queryClient } from "@/components/providers/ReactQueryProvider";
import {
  getMyProfile,
  signInUser,
  signUpUser,
  updateMyProfile,
} from "@/lib/actions/auth";
import { SignInFormData, SignUpFormData, UserProfileType } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "../config/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { OrderDetailsType } from "@/types/product";

// 로그인
export const useSignInMutation = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: SignInFormData) => signInUser(formData),
    onSuccess: () => {
      toast.success("로그인에 성공하였습니다.");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message === "INVALID_CREDENTIALS") {
          setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          setErrorMessage("오류가 발생했습니다. 관리자에게 문의해주세요.");
        }
      } else {
        setErrorMessage(
          "예기치 못한 오류가 발생했습니다. 관리자에게 문의해주세요.",
        );
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending, errorMessage };
};

// 회원가입
export const useSignUpMutation = () => {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: SignUpFormData) => signUpUser(formData),

    onSuccess: () => {
      toast.success("회원가입에 성공하였습니다.");
      router.push("/");
    },
    onError: (error) => {
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;
        const message = (error as { message: string }).message;

        if (status === 400) {
          toast.error("잘못된 로그인 정보입니다.");
        } else if (status === 500) {
          toast.error("서버 에러입니다.");
        } else {
          toast.error(`알 수 없는 오류: ${message}`);
        }
      } else {
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending };
};

// 내 프로필 조회
export function useMyProfileQuery(userId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myProfile", userId],
    queryFn: () => getMyProfile(userId || ""),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 내 프로필 수정
export function useUpdateMyProfileMutation(userId: string | undefined) {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: UserProfileType) => updateMyProfile(formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myProfile", userId] });
      toast.success("프로필 수정에 성공하였습니다.");
      router.push("/mypage/profile");
    },
    onError: (error) => {
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;
        const message = (error as { message: string }).message;

        if (status === 400) {
          toast.error("잘못된 정보입니다.");
        } else if (status === 500) {
          toast.error("서버 에러입니다.");
        } else {
          toast.error(`알 수 없는 오류: ${message}`);
        }
      } else {
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending };
}

// 프로필 이미지 업로드
export const uploadImageToStorageProfile = async (
  userId: string,
  file: File,
): Promise<string> => {
  const supabase = createBrowserSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_USER_BUCKET;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cleanFileName = file.name.replace(/[^\w.-]/g, ""); // 안전한 ASCII 문자만 사용
  const fileName = `${userId}/${uuidv4()}-${cleanFileName}`;

  if (!bucket || !projectUrl) {
    throw new Error("env 설정 안했음");
  }

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError || !data?.path) {
    console.error("이미지 업로드 실패:", uploadError?.message);
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const publicUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${data.path}`;
  return publicUrl;
};

// 주문목록 조회 (관리자용)
export async function getOrders(
  userId: string,
  filter: { searchKeyword?: string; year?: number; recent6Months?: boolean },
  page = 1,
  limit = 10,
  userLevel?: number,
) {
  const supabase = createBrowserSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders_with_user_info")
    .select(
      `
      id,
      created_at,
      user_id,
      user_name,
      email,
      order_items (
        id,
        product_id,
        quantity,
        price,
        size,
        delivery_status,
        products (
          name,
          image_url
        )
      )
    `,
      { count: "exact" },
    )
    .range(from, to)
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  // 관리자 아닐 경우 본인 주문만
  if (userLevel !== 3) {
    query = query.eq("user_id", userId);
  }

  // 검색어 필터 (user_name 또는 email)
  if (filter.searchKeyword && filter.searchKeyword.trim() !== "") {
    query = query.or(
      `user_name.ilike.%${filter.searchKeyword}%,email.ilike.%${filter.searchKeyword}%`,
    );
  }

  // 날짜 필터
  if (filter.recent6Months) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    query = query.gte("created_at", sixMonthsAgo.toISOString());
  } else if (filter.year) {
    const start = new Date(filter.year, 0, 1).toISOString();
    const end = new Date(filter.year + 1, 0, 1).toISOString();
    query = query.gte("created_at", start).lt("created_at", end);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { data, count };
}

export function useGetOrders(
  userId: string,
  filter: { searchKeyword?: string; year?: number; recent6Months?: boolean },
  page?: number,
  limit?: number,
  userLevel?: number,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", userId, filter, page, limit, userLevel],
    queryFn: () => getOrders(userId, filter, page, limit, userLevel),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 사용자용 주문목록 조회 (상품명 검색 가능)
export async function getUserOrders(
  userId: string,
  filter: { searchKeyword?: string; year?: number; recent6Months?: boolean },
  page = 1,
  limit = 10,
) {
  const supabase = createBrowserSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders_with_user_info")
    .select(
      `
      id,
      created_at,
      user_id,
      user_name,
      email,
      product_names,
      order_items (
        id,
        product_id,
        quantity,
        price,
        size,
        delivery_status,
        products (
          name,
          image_url
        )
      )
    `,
      { count: "exact" },
    )
    .eq("deleted", false)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  // 상품명 검색 (뷰의 product_names 대상)
  if (filter.searchKeyword && filter.searchKeyword.trim() !== "") {
    const kw = `%${filter.searchKeyword.trim()}%`;
    query = query.ilike("product_names", kw);
  }

  // 기간 필터
  if (filter.recent6Months) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    query = query.gte("created_at", sixMonthsAgo.toISOString());
  } else if (filter.year) {
    const start = new Date(filter.year, 0, 1).toISOString();
    const end = new Date(filter.year + 1, 0, 1).toISOString();
    query = query.gte("created_at", start).lt("created_at", end);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { data, count };
}

export function useGetUserOrders(
  userId: string,
  filter: { searchKeyword?: string; year?: number; recent6Months?: boolean },
  page?: number,
  limit?: number,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userOrders", userId, filter, page, limit],
    queryFn: () => getUserOrders(userId, filter, page, limit),
    enabled: !!userId,
  });

  return { data, isLoading, isError };
}

// 주문 상세 조회
export async function getOrderDetails(orderId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
          id, created_at, request, receiver, detail_address,
          user: user_table (user_name, email),
          order_items (
            id,
            quantity,
            price,
            size,
            delivery_status,
            products (
              name,
              image_url,
              id
            )
          )`,
    )
    .eq("id", orderId)
    .order("created_at", { ascending: false })
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function useGetOrderDetails(orderId: string) {
  const { data, isLoading, isError } = useQuery<OrderDetailsType>({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetails(orderId || ""),
    enabled: !!orderId,
    refetchOnMount: "always",
    retry: false,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 주문 내역 삭제
export async function deleteOrder(orderId: string) {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({
      deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
  return true;
}

export function useDeleteOrderMutation(
  orderId: string,
  userId: string,
  manage?: boolean,
) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderDetails", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
      toast.success("주문 내역이 삭제되었습니다.");
      if (manage) {
        router.replace("/products/orderList");
      } else {
        router.replace("/mypage/orderList?page=1");
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error("오류가 발생했습니다. 관리자에게 문의해주세요.");
        console.error(`오류 발생: ${error.message}`);
      } else {
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    },
  });

  return { mutate, isPending };
}

// 주문 취소
async function updateCancelOrderItem(orderId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("order_items")
    .update({ delivery_status: "취소됨" })
    .eq("id", orderId)
    .select("id, order_id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export const useUpdateCancelOrderItem = (userId: string) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (orderId: string) => updateCancelOrderItem(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
      queryClient.invalidateQueries({
        queryKey: ["orderDetails", data?.order_id],
      });
      toast.success("주문이 취소되었습니다.");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error("오류가 발생했습니다. 관리자에게 문의해주세요.");
        console.error(`오류 발생: ${error.message}`);
      } else {
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    },
  });

  return { mutate, isPending };
};
