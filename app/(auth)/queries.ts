"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signInUser, signUpUser } from "./actions";
import { useState } from "react";

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

// 로그인
export const useSignInMutation = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (formData: SignInFormData) => signInUser(formData),
    onSuccess: () => {
      alert("로그인에 성공하였습니다.");
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
      alert("회원가입에 성공하였습니다.");
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
