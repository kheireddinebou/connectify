"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);


  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      toast.error("There was a problem sign in out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="ghost" className="text-gray-800" onClick={handleSignOut}>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <LogOut className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SignOutButton;
