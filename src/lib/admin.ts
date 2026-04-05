import { auth } from "./auth";

export async function isAdmin() {
  const session = await auth();
  if (!session?.user?.email) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return true;
  return session.user.email.toLowerCase() === adminEmail.toLowerCase();
}
