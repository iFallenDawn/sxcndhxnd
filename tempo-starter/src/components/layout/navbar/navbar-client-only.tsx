"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import UserProfile from "../../user/user-profile";
import NavbarClient from "./navbar-client";
import { User } from "@supabase/supabase-js";

export default function NavbarClientOnly() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <NavbarClient user={null} />;
  }

  return (
    <NavbarClient user={user}>
      {user && <UserProfile />}
    </NavbarClient>
  );
}