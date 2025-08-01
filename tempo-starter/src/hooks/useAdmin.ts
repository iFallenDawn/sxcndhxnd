"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";

interface UseAdminReturn {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
}

export function useAdmin(): UseAdminReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if user has admin role
        const { data, error } = await supabase
          .from("users_roles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(data.role === "admin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading, user };
}