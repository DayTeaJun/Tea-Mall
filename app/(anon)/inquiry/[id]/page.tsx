import React from "react";
import InquiryDetailComponent from "./_components/InquiryDetailComponent";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="w-full text-black">
      <InquiryDetailComponent inquiryId={Number(id)} />
    </div>
  );
}

export default InquiryDetailPage;
