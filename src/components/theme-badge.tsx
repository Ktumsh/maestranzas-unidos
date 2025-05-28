interface ThemeBadgeProps {
  dataTheme: string;
}

const ThemeBadge = ({ dataTheme }: ThemeBadgeProps) => {
  return (
    <div
      data-theme={dataTheme}
      className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
    >
      <div className="bg-base-content size-1 rounded-full" />
      <div className="bg-primary size-1 rounded-full" />
      <div className="bg-secondary size-1 rounded-full" />
      <div className="bg-accent size-1 rounded-full" />
    </div>
  );
};

export default ThemeBadge;
