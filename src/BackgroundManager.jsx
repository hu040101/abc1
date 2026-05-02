import { useState, useEffect } from 'react';
import { getBackgroundSettings } from './store';

export default function BackgroundManager({ refreshTrigger }) {
  const [bg, setBg] = useState(null);

  useEffect(() => {
    async function loadBg() {
      const settings = await getBackgroundSettings();
      if (settings) {
        setBg(settings);
      }
    }
    loadBg();
  }, [refreshTrigger]);

  useEffect(() => {
    if (bg) {
      if (bg.type === 'color') {
        document.body.style.background = bg.value;
        document.body.style.backgroundImage = 'none';
      } else if (bg.type === 'gradient') {
        document.body.style.backgroundImage = bg.value;
      } else if (bg.type === 'image') {
        document.body.style.backgroundImage = `url(${bg.value})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } else {
      // Default elegant gradient
      document.body.style.backgroundImage = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }
  }, [bg]);

  return null;
}
