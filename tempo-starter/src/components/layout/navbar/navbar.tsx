import { createClient } from "../../../../supabase/server";
import UserProfile from "../../user/user-profile";
import NavbarChakra from "./navbar-chakra";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <NavbarChakra user={user}>
      {user && <UserProfile />}
    </NavbarChakra>
  );
}
