import Link from "next/link";

import Logo from "@/components/logo";

const AuthHeader = () => {
  return (
    <Link
      href="/auth/login"
      className="flex items-center gap-2 self-center font-medium"
    >
      <div className="size-7 overflow-hidden rounded-md border">
        <Logo size={28} className="h-7" />
      </div>
      <span>Maestranzas Unidos S.A.</span>
    </Link>
  );
};

export default AuthHeader;
