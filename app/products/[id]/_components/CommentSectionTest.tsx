import { Star } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

const dummyReviewStats = {
  average: 4.8,
  totalCount: 30,
  keywords: {
    size: [
      { label: "정size예요", percent: 77 },
      { label: "생각보다 커요", percent: 23 },
    ],
    color: [
      { label: "화면과 같아요", percent: 67 },
      { label: "화면과 비슷해요", percent: 33 },
    ],
  },
  galleryImages: [],
};

const dummyReviews = [
  {
    id: "1",
    nickname: "지카곰",
    date: new Date("2025-05-26"),
    rating: 5,
    content:
      "트래블클럽 바리 베이지 라운드 카라 반팔 니트 (7 COLORS M~5XL) 카라특징, 5XL\n\n처음엔 color 때문에 살짝 고민했는데 입어보니 시원하고 착용감이 좋아요!",
    images: dummyReviewStats.galleryImages,
    profileImage: "/dummy/user1.png",
    productName:
      "트래블클럽 바리 베이지 라운드 카라 반팔 니트 (7 COLORS M~5XL)",
  },
];

export default function CommentsSection() {
  return (
    <section className="mt-10 space-y-6">
      {/* 별점 & 총 개수 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">상품평</h2>

        <div className="flex items-center gap-2 text-yellow-500 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} fill="#facc15" className="text-yellow-400" />
          ))}
          <span className="text-black text-lg font-bold">
            {dummyReviewStats.totalCount}
          </span>
          <span className="text-sm text-blue-600 underline cursor-pointer">
            자세히 보기
          </span>
        </div>
      </div>

      {/* 대표 이미지 갤러리 */}
      <div className="flex gap-2 overflow-x-auto">
        {dummyReviewStats.galleryImages.slice(0, 7).map((img, i) => (
          <div
            key={i}
            className="relative w-28 h-28 border rounded overflow-hidden"
          >
            <Image
              src={img}
              alt={`gallery-${i}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
        <div className="w-28 h-28 flex items-center justify-center bg-gray-100 text-sm font-semibold">
          더보기
        </div>
      </div>

      {/* 키워드 기반 통계 */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(dummyReviewStats.keywords).map(([category, values]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold mb-1">{category}</h3>
            {values.map(({ label, percent }, idx) => (
              <div key={idx} className="mb-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{label}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${
                      category === "size"
                        ? "bg-green-400"
                        : category === "color"
                        ? "bg-blue-400"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 개별 리뷰 카드 */}
      <div className="space-y-6 mt-8 border-t pt-6">
        {dummyReviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={review.profileImage}
                alt="profile"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <div>
                <p className="text-sm font-medium">{review.nickname}</p>
                <p className="text-xs text-gray-400">
                  {format(review.date, "yyyy.MM.dd")}
                </p>
              </div>
            </div>

            {/* 별점 */}
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < review.rating ? "#facc15" : "none"}
                  className={
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }
                />
              ))}
            </div>

            {/* 상품명 */}
            <p className="text-sm font-semibold text-gray-800">
              {review.productName}
            </p>

            {/* 이미지 */}
            <div className="flex gap-2 mt-2">
              {review.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`review-${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 리뷰 내용 */}
            <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
