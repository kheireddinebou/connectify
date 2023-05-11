import LoginButton from "@/components/LoginButton";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <section className="min-h-screen w-screen">
      <div className="flex flex-col items-center pt-6 max-w-md mx-auto">
        <Image
          src="/logo.png"
          alt="connectify"
          priority
          width={300}
          height={300}
          quality={100}
          style={{ objectFit: "contain" }}
        />
        <span className="text-black text-2xl font-medium mb-8 mt-14">
          Sign in to your account
        </span>
        <LoginButton />
      </div>
    </section>
  );
};

export default page;
