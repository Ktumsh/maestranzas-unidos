import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width, height, className }: LogoProps) => {
  return (
    <Image
      aria-label="Logo Essentia"
      src="/logo/maestranza-logo.webp"
      alt="Logo Maestranza Unidos S.A."
      width={width || 20}
      height={height || 20}
      className={cn("h-5 w-auto shrink-0", className)}
    />
  );
};

export default Logo;
