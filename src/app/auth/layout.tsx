import AuthHeader from "./_components/auth-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex min-h-svh w-full items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <AuthHeader />
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
