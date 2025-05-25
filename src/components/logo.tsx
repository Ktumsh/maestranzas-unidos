import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo = ({ size, className }: LogoProps) => {
  return (
    <Image
      aria-label="Logo Essentia"
      src="/logo/maestranza-logo.webp"
      alt="Logo Maestranza Unidos S.A."
      width={size || 32}
      height={size || 32}
      className={cn("h-8 w-auto shrink-0", className)}
    />
  );
};

export default Logo;
