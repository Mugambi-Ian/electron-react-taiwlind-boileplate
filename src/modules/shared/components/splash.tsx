import { useEffect, useState } from 'react';

export function AppSplash() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1350);
  }, []);
  if (loading)
    return (
      <section className="fixed inset-0 z-50 flex h-screen w-screen justify-center bg-white">
        <img
          alt="splash"
          src="./assets/images/app_logo.png"
          className="splash h-[244px] w-[240px] self-center object-contain "
        />
      </section>
    );
  return <span />;
}
