"use client";

import { queryClient } from "@/components/providers/ReactQueryProvider";
import {
  delDeliveryAddress,
  deleteInquiry,
  getMyAddressList,
  getMyDefaultAddress,
  getMyProfile,
  patchDeliveryAddress,
  postDefaultDeliveryAddress,
  postDeliveryAddress,
  signInUser,
  signUpOAuth,
  signUpUser,
  updateMyProfile,
} from "@/lib/actions/auth";
import {
  SignInFormData,
  SignUpFormData,
  UserProfileType,
  UserType,
} from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "../config/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { OrderDetailsType } from "@/types/product";
import { useAuthStore } from "../store/useAuthStore";
import { DeliveryAddressForm } from "@/app/(member)/mypage/delivery/regist/page";

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

// 소셜 로그인 (회원가입)
export const useSignUpOAuthMutation = () => {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: SignUpFormData) => signUpOAuth(formData),

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

// 내 배송지 조회
export function useGetAddressList(userId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myAddressList", userId],
    queryFn: () => getMyAddressList(userId || ""),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 내 기본 배송지 조회
export function useGetDefaultAddress(userId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myDefaultAddress", userId],
    queryFn: () => getMyDefaultAddress(userId || ""),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 내 배송지 기본 배송지로 설정
export function usePostDefaultDeliveryAddressMutation(userId: string) {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (addressId: string) =>
      postDefaultDeliveryAddress(addressId, userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myAddressList", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["myDefaultAddress", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["myProfile", userId] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
      ]);

      toast.success("기본 배송지로 적용되었습니다.");

      router.refresh();
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

  return { data, isError, mutate, isSuccess, isPending };
}

// 내 배송지 등록
export function usePostDeliveryAddressMutation(
  userId: string,
  isModal: boolean = false,
) {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: DeliveryAddressForm) =>
      postDeliveryAddress(formData),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["myAddressList", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["myProfile", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["myDefaultAddress", userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["userProfile", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
      ]);
      toast.success("배송지가 등록되었습니다.");

      if (!isModal) {
        router.push("/mypage/delivery");
      }
      router.refresh();
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

  return { data, isError, mutate, isSuccess, isPending };
}

// 내 배송지 수정
export function usePatchDeliveryAddressMutation(
  userId: string,
  addressId: string,
  isModal: boolean = false,
) {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: DeliveryAddressForm) =>
      patchDeliveryAddress(addressId, formData),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["myAddressList", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["myProfile", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["myDefaultAddress", userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["userProfile", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
      ]);

      toast.success("배송지가 수정되었습니다.");

      if (!isModal) {
        router.push("/mypage/delivery");
      }
      router.refresh();
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

  return { data, isError, mutate, isSuccess, isPending };
}

// 내 배송지 삭제
export function useDelDeliveryAddressMutation(userId: string) {
  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (addressId: string) => delDeliveryAddress(addressId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["myAddressList", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["myProfile", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["myDefaultAddress", userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["userProfile", userId],
        }),
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
      ]);
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

  return { data, isError, mutate, isSuccess, isPending };
}

// 내 프로필 수정
export function useUpdateMyProfileMutation(userId: string | undefined) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: UserProfileType) => updateMyProfile(formData),
    onSuccess: async (_data, formData) => {
      await queryClient.invalidateQueries({ queryKey: ["myProfile", userId] });
      toast.success("프로필 수정에 성공하였습니다.");

      if (user) {
        const updatedUser: UserType = {
          ...user,
          user_name: formData.user_name ?? user.user_name,
          phone: formData.phone ?? user.phone,
        };

        router.push("/mypage/profile");
        setUser(updatedUser);
      }
    },
    onError: (error) => {
      const errorMessage = error?.message || "";

      if (
        errorMessage.includes("중복") ||
        errorMessage.includes("사용 중인 이름")
      ) {
        toast.error("이미 사용 중인 이름입니다. 다른 이름을 입력해 주세요.");
        return;
      }

      if (error && typeof error === "object" && "status" in error) {
        const status = error.status;
        if (status === 400) {
          toast.error("잘못된 정보입니다.");
        } else if (status === 500) {
          toast.error("서버 에러가 발생했습니다.");
        } else {
          toast.error(`오류 발생: ${errorMessage}`);
        }
      } else {
        toast.error(errorMessage || "예상치 못한 오류가 발생했습니다.");
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

// 주문목록 조회 (사용자 및 관리자용)
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

  if (filter.searchKeyword && filter.searchKeyword.trim() !== "") {
    if (userLevel === 3) {
      query = query.or(
        `user_name.ilike.%${filter.searchKeyword}%,email.ilike.%${filter.searchKeyword}%`,
      );
    } else {
      const kw = `%${filter.searchKeyword.trim()}%`;
      query = query.ilike("product_names", kw);
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

export function useDeleteOrderMutation(userId: string, page?: string) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: async (_, orderId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orderDetails", orderId] }),
        queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
      ]);
      toast.success("주문 내역이 삭제되었습니다.");
      if (page === "manage") {
        router.replace("/manage/orderList");
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
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["orderDetails", data?.order_id],
        }),
      ]);
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

// 리뷰 전체 조회
export function useGetReviews(userId: string, page: number, limit: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", userId, page],
    queryFn: () => getReviews(userId, page, limit),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

async function getReviews(userId: string, page: number, limit: number) {
  const supabase = createBrowserSupabaseClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      products (
        image_url,
        name
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const formattedReviews = data.map((review) => ({
    ...review,
    product_image: review.products?.image_url,
    product_name: review.products?.name,
  }));

  return {
    reviews: formattedReviews,
    count: count || 0,
  };
}

// 작성가능한 리뷰 조회
export async function getAvailableReviews(
  userId: string,
  page: number,
  limit: number,
) {
  const supabase = createBrowserSupabaseClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("available_review_products")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .range(from, to);

  if (error) throw new Error(error.message);

  const formattedItems = (data || []).map((item) => ({
    id: item.order_item_id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_description: item.product_description,
    product_image: item.product_image,
    delivered_at: "배송완료",
  }));

  return {
    items: formattedItems,
    count: count || 0,
  };
}

export function useGetAvailableReviews(
  userId: string,
  page: number,
  limit: number,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["availableReviews", userId, page],
    queryFn: () => getAvailableReviews(userId, page, limit),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 리뷰 삭제
async function delReview(userId: string, reviewId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", userId)
    .eq("id", reviewId);

  if (error) throw new Error(error.message);

  return data;
}

export const useDelReview = (userId: string) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (reviewId: string) => delReview(userId, reviewId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", userId] });
      toast.success("리뷰가 삭제되었습니다.");
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

// 작성가능한 리뷰 숨기기
export async function postHiddenReview(orderItemId: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("order_items")
    .update({ is_hidden: true })
    .eq("id", orderItemId);

  if (error) throw new Error(error.message);
  return data;
}

export function usePostHiddenReview(userId: string, page: number) {
  const { mutate, isPending } = useMutation({
    mutationFn: (orderItemId: string) => postHiddenReview(orderItemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["availableReviews", userId, page],
      });
      toast.success("숨김 처리되었습니다.");
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

export interface InquiryPostType {
  title: string;
  content: string;
  guest_name: string | null;
  phone_number: string | null;
  email: string | null;
  password?: string | null;
  is_public: boolean;
  is_privacy_agreed: boolean;
  user_id: string | null;
  status: string;
  inquiry_type: string;
  image_urls: string[] | null;
}

// 문의등록
export const postInquiry = async (inquiryData: InquiryPostType) => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("inquiries")
    .insert([
      {
        title: inquiryData.title,
        content: inquiryData.content,
        guest_name: inquiryData.guest_name,
        phone_number: inquiryData.phone_number,
        email: inquiryData.email,
        password: inquiryData.password || null,
        is_public: inquiryData.is_public,
        is_privacy_agreed: inquiryData.is_privacy_agreed,
        user_id: inquiryData.user_id || null,
        status: "PENDING",
        inquiry_type: inquiryData.inquiry_type,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const usePostInquiryMutation = () => {
  return useMutation({
    mutationFn: (newInquiry: InquiryPostType) => postInquiry(newInquiry),
    onSuccess: () => {
      toast.success("문의가 성공적으로 등록되었습니다.");

      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
    onError: (error) => {
      console.error("문의 등록 실패:", error);
      toast.error(
        `등록에 실패했습니다: ${error.message || "다시 시도해주세요."}`,
      );
    },
  });
};

export const postInquiryComment = async (
  userId: string,
  inquiryId: number,
  comment: string,
) => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      answer_content: comment.trim(),
      answered_at: new Date().toISOString(),
      admin_id: userId || null,
      status: "ANSWERED",
    })
    .eq("id", inquiryId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const usePostInquiryCommentMutation = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userId,
      inquiryId,
      comment,
    }: {
      userId: string;
      inquiryId: number;
      comment: string;
    }) => postInquiryComment(userId, inquiryId, comment),
    onSuccess: async () => {
      toast.success("답변이 성공적으로 등록되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("답변 등록 실패:", error);
      toast.error(
        `등록에 실패했습니다: ${error.message || "다시 시도해주세요."}`,
      );
    },
  });

  return { mutate, isPending };
};

// 문의 답변 수정
export const updateInquiryComment = async (
  inquiryId: number,
  comment: string,
) => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      answer_content: comment.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", inquiryId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useUpdateInquiryCommentMutation = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      inquiryId,
      comment,
    }: {
      inquiryId: number;
      comment: string;
    }) => updateInquiryComment(inquiryId, comment),
    onSuccess: async () => {
      toast.success("답변이 수정되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("답변 수정 실패:", error);
      toast.error(
        `수정에 실패했습니다: ${error.message || "다시 시도해주세요."}`,
      );
    },
  });

  return { mutate, isPending };
};

// 답변 삭제
export const deleteInquiryComment = async (inquiryId: number) => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("inquiries")
    .update({
      answer_content: null,
      answered_at: null,
      admin_id: null,
      status: "WAITING",
    })
    .eq("id", inquiryId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useDeleteInquiryCommentMutation = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (inquiryId: number) => deleteInquiryComment(inquiryId),
    onSuccess: async () => {
      toast.success("답변이 삭제되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("답변 삭제 실패:", error);
      toast.error(
        `삭제에 실패했습니다: ${error.message || "다시 시도해주세요."}`,
      );
    },
  });

  return { mutate, isPending };
};

// 고객센터 문의 상세 조회
export const getInquiryDetail = async (inquiryId: number) => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export function useGetInquiryDetail(inquiryId: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inquiries", inquiryId],
    queryFn: () => getInquiryDetail(inquiryId),
    enabled: !!inquiryId,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

// 문의 삭제
interface DeleteVariables {
  inquiryId: number;
  guestPassword?: string;
}

export const useDeleteInquiry = (isAdmin: boolean) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ inquiryId, guestPassword }: DeleteVariables) =>
      deleteInquiry(inquiryId, guestPassword, isAdmin),

    onSuccess: async () => {
      toast.success("문의가 삭제되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("문의 삭제 실패:", error);
      toast.error(
        `삭제에 실패했습니다: ${error.message || "다시 시도해주세요."}`,
      );
    },
  });

  return { mutate, isPending };
};
