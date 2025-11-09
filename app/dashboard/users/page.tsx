import { getAdminUsers, getAuthUser } from "./users.actions";

import UserClient from "./user-client";
import type { User } from "@supabase/auth-js";

export default async function UsersPage() {
  const authUser = await getAuthUser();
  const initialUsers: User[] = await getAdminUsers();

  return < UserClient authUser={authUser} initialUsers={initialUsers} />;
}

