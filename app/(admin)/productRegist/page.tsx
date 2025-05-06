"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToStorage } from "@/lib/queries/admin";
import { createProduct } from "@/lib/actions/admin";
import { Label } from "@radix-ui/react-label";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("상품 이미지를 선택해주세요.");
      return;
    }
    setUploading(true);

    const imageUrl = await uploadImageToStorage(file);

    if (imageUrl) {
      const upload = await createProduct({
        name,
        description,
        price: Number(price),
        imageUrl,
      });

      if (!upload) {
        alert("상품 등록에 실패했습니다.");
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    alert("상품 등록 성공");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 space-y-5 bg-white rounded-xl">
      <h2 className="text-center text-3xl font-bold">상품 등록</h2>
      <div className="space-y-2">
        <Label htmlFor="name">상품 이름</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="상품 이름"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">상품 설명</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 설명"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">가격</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="가격"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">상품 이미지</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <Button onClick={handleSubmit} disabled={uploading}>
        {uploading ? "업로드 중..." : "상품 등록"}
      </Button>
    </div>
  );
}
