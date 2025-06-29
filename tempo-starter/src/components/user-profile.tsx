"use client";
import { UserCircle } from "lucide-react";
import {
  Button,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
} from "@chakra-ui/react";
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
    <Flex gap={4} align="center">
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" size="sm" p={2}>
            <UserCircle size={24} />
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverBody>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                w="full"
                justifyContent="flex-start"
              >
                Sign out
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}
