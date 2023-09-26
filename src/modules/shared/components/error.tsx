import Lottie from 'lottie-react';

import anim404 from '../lottie/404.json';
import { AppSection } from './section';

export function AppError() {
  return (
    <AppSection className="fade-in mb-12 max-w-7xl flex-col gap-4 px-5">
      <Lottie animationData={anim404} className="h-[500px] self-center" />
    </AppSection>
  );
}
