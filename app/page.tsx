import { redirect } from "next/navigation";

// Root page redirects to default locale
// The middleware handles runtime redirects, but this ensures
// the page can be statically rendered during build
export default function RootPage() {
  redirect("/us/en");
}
