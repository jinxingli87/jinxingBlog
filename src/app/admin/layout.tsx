import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    !!session.user.email &&
    !!adminEmail &&
    session.user.email.toLowerCase() === adminEmail.toLowerCase();

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
