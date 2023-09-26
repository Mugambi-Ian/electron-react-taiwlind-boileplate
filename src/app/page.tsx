import React from 'react';
import '@/css/global.css';

import { useAppRemote } from '@/hooks/remote';

function App() {
  useAppRemote();
  return <span className="bg-accent">Edit Here</span>;
}

export default App;
