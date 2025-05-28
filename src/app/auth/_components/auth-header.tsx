import Link from "next/link";

import Logo from "@/components/logo";
import ThemeController from "@/components/theme-controller";

const AuthHeader = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Link
        href="/auth/login"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="size-7 overflow-hidden rounded-md border">
          <Logo size={28} className="h-7" />
        </div>
        <span>Maestranzas Unidos S.A.</span>
      </Link>
      <ThemeController />
    </div>
  );
};

export default AuthHeader;
