import { createClient } from "../../../../supabase/server";
import UserProfile from "../../user/user-profile";
import NavbarClient from "./navbar-client";

export default async function NavbarWrapper() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <NavbarClient user={user}>
      {user && <UserProfile />}
    </NavbarClient>
  );
}