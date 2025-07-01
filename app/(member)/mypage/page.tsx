import { redirect } from "next/navigation";

export default function MyPageRedirect() {
  return redirect("/mypage/profile");
}
