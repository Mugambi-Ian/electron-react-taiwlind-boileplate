import Lottie from 'lottie-react';

import animLoading from '../lottie/loading.json';
import { AppSection } from './section';

export function AppLoading() {
  return (
    <AppSection className="fade-in flex h-[550px] flex-col justify-center gap-4">
      <Lottie animationData={animLoading} className="w-1/3 self-center" />
    </AppSection>
  );
}
