import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Lightbox({ image, images = [], onClose, onNext, onPrev }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, [image?.id]);

  if (!image) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') onNext?.();
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.002;
      setScale(prev => { let newScale = prev + prev * zoomFactor; return Math.min(Math.max(1, newScale), 8); });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [image?.id]);

  useEffect(() => { if (scale <= 1) { setPosition({ x: 0, y: 0 }); } }, [scale]);

  const handleMouseDown = (e) => { if (scale > 1) { e.preventDefault(); setIsDragging(true); dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }; } };
  const handleMouseMove = (e) => { if (!isDragging) return; setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }); };
  const handleMouseUp = () => { setIsDragging(false); };

  const overlayContent = (
    <div className="lightbox-overlay" onClick={onClose} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <button className="lightbox-close" onClick={onClose} title="Close">✕</button>
      {onPrev && <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} title="Previous (Left Arrow)">‹</button>}
      {onNext && <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); onNext(); }} title="Next (Right Arrow)">›</button>}
      <div className="lightbox-info">
        <span className="image-counter">{images.findIndex(img => img.id === image.id) + 1} / {images.length}</span>
        <span className="close-hint">Esc to close</span>
      </div>
      <div className="lightbox-container" ref={containerRef} onClick={(e) => e.stopPropagation()}>
        <img key={image.id} src={image.url} alt={image.name} className="lightbox-img" draggable="false"
          onMouseDown={handleMouseDown}
          onClick={() => { if (scale === 1) setScale(2.5); }}
          onDoubleClick={(e) => { e.stopPropagation(); setScale(1); }}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
          title={scale > 1 ? "Drag to pan, scroll to zoom, double-click to reset" : "Click to zoom in, scroll to zoom"}
        />
      </div>
      {image.note && (
        <div className="museum-placard" onClick={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <div className="placard-inner">
            <div className="placard-pin"></div>
            <div className="placard-content">{image.note}</div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(overlayContent, document.body);
}
