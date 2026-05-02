import { useState, useEffect } from 'react';
import { getBackgroundSettings } from './store';

export default function BackgroundManager({ refreshTrigger }) {
  const [bgSettings, setBgSettings] = useState(null);
  const [bgUrl, setBgUrl] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Handle Parallax Scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let currentUrl = null;

    const loadBg = async () => {
      const settings = await getBackgroundSettings();
      setBgSettings(settings);

      if (settings?.file) {
        // Local file object (from SettingsModal upload)
        currentUrl = URL.createObjectURL(settings.file);
        setBgUrl(currentUrl);
      } else if (settings?.url) {
        // Static URL from gallery.json (e.g. "bg.jpg")
        setBgUrl(`${import.meta.env.BASE_URL}${settings.url}`);
      } else {
        setBgUrl(null);
      }
    };

    loadBg();

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [refreshTrigger]);

  if (!bgSettings || !bgUrl) return null;

  // Extract base Y from position string (e.g., "50% 50%")
  let posY = "50%";
  if (bgSettings.position && typeof bgSettings.position === 'string') {
    const parts = bgSettings.position.split(' ');
    if (parts.length === 2) {
      posY = parts[1];
    }
  }

  // Parallax calculation: Move background at 30% the speed of normal scrolling
  const parallaxPositionY = `calc(${posY} - ${scrollY * 0.3}px)`;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1, 
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: '100vw auto',
        backgroundPosition: `center ${parallaxPositionY}`,
        backgroundRepeat: 'no-repeat',
        opacity: bgSettings.opacity !== undefined ? bgSettings.opacity : 1,
        filter: `blur(${bgSettings.blur || 0}px)`,
        transform: bgSettings.blur ? 'scale(1.05)' : 'none', 
        transition: 'opacity 0.3s ease-out, filter 0.3s ease-out' 
      }}
    />
  );
}
