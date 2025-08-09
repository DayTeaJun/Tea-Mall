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

// 주문목록 조회
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
    .select("*", { count: "exact" })
    .range(from, to)
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  // 본인 주문만
  if (userLevel !== 3) {
    query = query.eq("user_id", userId);
  }

  // 검색어 필터링
  if (filter.searchKeyword && filter.searchKeyword.trim() !== "") {
    const keyword = `%${filter.searchKeyword.trim()}%`;

    if (userLevel === 3) {
      query = query.or(`user_name.ilike.${keyword},email.ilike.${keyword}`);
    } else {
      query = query.ilike("product_name", keyword);
    }
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

type ProductLite = { name: string; image_url: string | null };
type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string | null;
  delivery_status: string | null;
  products: ProductLite;
};
type OrderRow = {
  id: string;
  created_at: string | null;
  user_id: string;
  user_name?: string | null;
  email?: string | null;
  order_items: OrderItem[] | null; // ← Supabase JSON에서 올 수 있으니 null 허용
};
type OrdersResponse = { data: OrderRow[]; count: number | null };

export function useGetOrders(
  userId: string,
  filter: { searchKeyword?: string; year?: number; recent6Months?: boolean },
  page = 1,
  limit = 10,
  userLevel?: number,
) {
  const { data, isLoading, isError } = useQuery<OrdersResponse>({
    queryKey: ["orders", userId, filter, page, limit, userLevel],
    queryFn: async () => {
      const raw = await getOrders(userId, filter, page, limit, userLevel);

      // 안전 가공: order_items를 항상 OrderItem[]로 강제
      const normalized: OrdersResponse = {
        count: raw.count ?? 0,
        data: (raw.data ?? []).map((row: any) => ({
          id: String(row.id),
          created_at: row.created_at ?? null,
          user_id: String(row.user_id),
          user_name: row.user_name ?? null,
          email: row.email ?? null,
          order_items: Array.isArray(row.order_items)
            ? row.order_items.map(
                (oi: any): OrderItem => ({
                  id: String(oi.id),
                  product_id: String(oi.product_id),
                  quantity: Number(oi.quantity ?? 0),
                  price: Number(oi.price ?? 0),
                  size: oi.size ?? null,
                  delivery_status: oi.delivery_status ?? null,
                  products: {
                    name: oi.products?.name ?? "",
                    image_url: oi.products?.image_url ?? null,
                  },
                }),
              )
            : [], // ← non-array면 빈배열
        })),
      };

      return normalized;
    },
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
