"use client";
import { UserCircle } from "lucide-react";
import { Button, IconButton } from "@chakra-ui/react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <UserCircle className="h-6 w-6" />
    </Button>
  );
}
