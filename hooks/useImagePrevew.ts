import { useState } from "react";
import { toast } from "sonner";

export function ImgPreview() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<File | null>(null);

  const onUpload = async (file: File): Promise<void> => {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    const fileExt = file?.name.split(".").pop()?.toLowerCase();

    if (!file || !fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error("이미지만 등록할 수 있습니다!");
      return;
    }

    setImgUrl(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageSrc(result);
      } else {
        setImageSrc(null);
      }
    };
  };

  return { imageSrc, imgUrl, onUpload };
}
