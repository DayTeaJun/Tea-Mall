import React from "react";
import InquiryLists from "./_components/InquiryLists";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const query = (searchParams.query as string) || "";
  const page = Number(searchParams.page) || 1;
  const type = (searchParams.type as string) || "all";

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">고객센터</h1>
      <InquiryLists page={page} query={query} type={type} />
    </div>
  );
}

export default page;
