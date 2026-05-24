interface AuthShellProps {
  children: React.ReactNode;
}

export const AuthShell = ({ children }: AuthShellProps) => (
  <div className="min-h-screen bg-cream">
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center border-x border-line bg-cream-50 px-4 py-10">
      <div className="w-full max-w-sm border border-line bg-surface p-6">{children}</div>
    </div>
  </div>
);
