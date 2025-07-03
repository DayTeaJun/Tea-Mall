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
  const fileName = `${userId}/${uuidv4()}-${file.name}`;

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
