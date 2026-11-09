import React, { useEffect } from 'react';
import { Desktop } from './components/desktop/Desktop';

export default function App() {
  useEffect(() => {
    // Set title and body styling
    document.title = 'NEW OS - Browser-Native Operating System';
  }, []);

  return <Desktop />;
}
