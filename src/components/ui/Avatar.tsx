import { FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string | null | undefined;
  alt: string | null | undefined;
  size?: number;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ src, alt, size, className }) => {
  return (
    <Image
      src={src || ""}
      referrerPolicy="no-referrer"
      alt={alt || ""}
      width={size || 45}
      height={size || 45}
      className={cn("rounded-full", className)}
    />
  );
};

export default Avatar;
