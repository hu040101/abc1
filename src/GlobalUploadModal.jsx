import { useState, useEffect } from 'react';
import { addImage } from './store';

export default function GlobalUploadModal({ isOpen, onClose, countries, onUploadComplete }) {
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (countries.length > 0 && !selectedCountryId) {
      setSelectedCountryId(countries[0].id);
    }
  }, [countries]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!selectedCountryId || files.length === 0) return;
    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        await addImage(selectedCountryId, null, files[i]);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      onUploadComplete(selectedCountryId);
      setFiles([]);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="lightbox-overlay" style={{ zIndex: 2000 }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>上传照片</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>选择地区</label>
          <select 
            value={selectedCountryId} 
            onChange={e => setSelectedCountryId(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>选择图片</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange}
            style={{ width: '100%' }}
          />
        </div>

        {uploading && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-color)', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>正在上传... {progress}%</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="sidebar-btn" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-color)' }} onClick={onClose}>取消</button>
          <button className="sidebar-btn" disabled={uploading || files.length === 0} onClick={handleUpload}>开始上传</button>
        </div>
      </div>
    </div>
  );
}
