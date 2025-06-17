import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const dummyComments = [
  {
    id: "1",
    userEmail: "user1@example.com",
    rating: 4,
    content: "상품 품질이 매우 만족스럽습니다. 배송도 빨랐어요!",
    createdAt: new Date("2025-06-10"),
    imageUrls: [],
  },
  {
    id: "2",
    userEmail: "hello123@domain.com",
    rating: 5,
    content: "디자인이 예뻐서 마음에 들어요. 다음에 또 구매할게요.",
    createdAt: new Date("2025-06-08"),
    imageUrls: [],
  },
  {
    id: "3",
    userEmail: "coolbuyer@naver.com",
    rating: 3,
    content: "괜찮긴 한데, 색상이 조금 달랐어요. 그래도 무난해요.",
    createdAt: new Date("2025-06-05"),
    imageUrls: [],
  },
];

interface Props {
  productId: string;
}

export default function CommentsSection({ productId }: Props) {
  return (
    <section className="mt-4 border-t">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold my-4">상품 리뷰</h2>
        <Link href={`/productReview/${productId}`} className="cursor-pointer">
          <span className="text-sm text-blue-600 hover:underline">
            리뷰 작성하기
          </span>
        </Link>
      </div>
      <ul className="space-y-6">
        {dummyComments.map((comment) => (
          <li key={comment.id} className="py-4 border-b">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>{comment.userEmail.split("@")[0]}</span>
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < comment.rating ? "text-yellow-400" : "text-gray-300"
                  }
                  fill={i < comment.rating ? "#facc15" : "none"}
                />
              ))}
            </div>

            <p className="text-gray-800 text-sm mb-2">{comment.content}</p>

            {comment.imageUrls.length > 0 && (
              <div className="flex gap-2 mt-2">
                {comment.imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded overflow-hidden border"
                  >
                    <Image
                      src={url}
                      alt={`review-${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
