import { v4 as uuidv4 } from "uuid";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { createProduct, deleteProduct, updateProduct } from "../actions/admin";
import { queryClient } from "@/components/providers/ReactQueryProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreateProductType, ProductType } from "@/types/product";

// 상품 이미지 업로드
export const uploadImageToStorage = async (
  userId: string,
  file: File,
): Promise<string> => {
  const supabase = createBrowserSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fileName = `${userId}/${uuidv4()}-${file.name}`;

  if (!bucket || !projectUrl) {
    throw new Error("env 설정 안했음");
  }

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError || !data?.path) {
    console.error("이미지 업로드 실패:", uploadError?.message);
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const publicUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${data.path}`;
  return publicUrl;
};

// 상품 등록 mutation
export const useCreateProductMutation = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: async (productForm: CreateProductType) =>
      createProduct(productForm),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("상품 등록이 완료되었습니다.");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending, errorMessage };
};

// 상품 삭제
export const useDeleteProductMutation = (productId: string) => {
  const router = useRouter();

  const { data, isError, mutate, isSuccess, isPending } = useMutation({
    mutationFn: async (imagePath: string) =>
      deleteProduct({ productId, imagePath }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products", productId],
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("상품 삭제가 완료되었습니다.");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isSuccess, isPending };
};

// 상품 수정
export const useUpdateProductMutation = (productId: string) => {
  const router = useRouter();

  const { data, isError, isPending, isSuccess, mutate } = useMutation({
    mutationFn: async (product: ProductType) => updateProduct(product),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products", productId],
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("상품이 성공적으로 수정되었습니다.");
      router.push(`/products/${productId}`);
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  return { data, isError, mutate, isPending, isSuccess };
};
