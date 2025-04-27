"use client";

import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../actions/auth";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

// 로그인
export const useLoginMutation = () => {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: LoginFormData) => signInUser(formData),
    onSuccess: () => {
      alert("로그인에 성공하였습니다.");
      router.push("/");
    },
    onError: (error) => {
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;
        const message = (error as { message: string }).message;

        if (status === 400) {
          alert("잘못된 로그인 정보입니다.");
        } else if (status === 500) {
          alert("서버 에러입니다.");
        } else {
          alert(`알 수 없는 오류: ${message}`);
        }
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending };
};
