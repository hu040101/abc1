import { useState } from 'react';
import { IS_VIEWER } from './config';

export default function ImageCard({ image, country, groups, onDelete, onUpdate, onImageClick, isSelectMode, isSelected, onToggleSelect }) {
  const [showNote, setShowNote] = useState(false);

  const handleGroupChange = (e) => {
    onUpdate(image, { groupId: e.target.value === "" ? null : e.target.value });
  };

  const handleNoteChange = (e) => {
    onUpdate(image, { note: e.target.value });
  };

  return (
    <div className={`image-card glass-panel ${isSelected ? 'selected' : ''}`} onClick={() => isSelectMode ? onToggleSelect(image.id) : onImageClick(image)}>
      {isSelectMode && (
        <div className="select-indicator">
          {isSelected ? '✓' : ''}
        </div>
      )}
      
      <div className="image-wrapper">
        <img src={image.url} alt={image.name} loading="lazy" />
      </div>
      
      <div className="image-info">
        <h3>{image.name}</h3>
        {image.note && <p className="image-note">{image.note}</p>}
        
        {!IS_VIEWER && !isSelectMode && (
          <div className="image-actions" onClick={(e) => e.stopPropagation()}>
            <select value={image.groupId || ""} onChange={handleGroupChange}>
              <option value="">未分类</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <button className="delete-btn" onClick={() => onDelete(image)}>删除</button>
          </div>
        )}
      </div>
    </div>
  );
}
