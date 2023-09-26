export function AppLogo() {
  return (
    <a
      href="/"
      title="Go To Our HomePage"
      aria-label="Prolox Solutions"
      className="flex flex-col py-3 max-lg:py-2"
    >
      <h1 className="text-[22px] font-black uppercase tracking-[0.24em] text-accent max-lg:text-xl max-lg:tracking-[0.18em] max-md:text-base max-md:tracking-widest">
        Prolox Solutions
      </h1>
      <div className="-mt-px flex w-[300px] flex-row items-center gap-2.5 self-center max-lg:w-64 max-md:-ml-1.5 max-md:w-44 max-md:gap-1">
        <span className="h-px flex-1 bg-primary" />
        <h2 className="text-sm font-bold tracking-[0.1em] text-primary max-lg:text-[13px] max-md:text-xs max-md:tracking-wide">
          Committed To Quality
        </h2>
        <span className="h-px flex-1 bg-primary" />
      </div>
    </a>
  );
}
