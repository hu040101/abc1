import { useState } from 'react';

export default function SettingsModal({ isOpen, onClose, onSettingsChanged }) {
  const [bgType, setBgType] = useState('gradient');
  const [bgValue, setBgValue] = useState('');

  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay" style={{ zIndex: 2000 }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>主题设置</h2>
        {/* Simplified for demo */}
        <p>在此调整画廊的背景和视觉风格。</p>
        <button className="sidebar-btn" onClick={onClose}>关闭</button>
      </div>
    </div>
  );
}
