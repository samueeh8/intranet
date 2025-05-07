import { requireAuth } from "@/lib/auth-guard";
import ClientAdminPage from "./ClientAdminPage"; 

export default async function AdminPage() {
  const session = await requireAuth(["admin"]);

  return <ClientAdminPage session={session} />;
}
