import { useState, useEffect } from 'react';

export default function Lightbox({ image, images, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&times;</button>
      <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>&#10094;</button>
      
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={image.url} alt={image.name} />
        <div className="lightbox-info glass-panel">
          <h3>{image.name}</h3>
          {image.note && <p>{image.note}</p>}
        </div>
      </div>
      
      <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); onNext(); }}>&#10095;</button>
    </div>
  );
}
