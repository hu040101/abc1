import { useState } from 'react';
import { addImage } from './store';

export default function ImageUploader({ countryId, groupId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        await addImage(countryId, groupId, file);
      }
      onUploadComplete();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader">
      <input 
        type="file" 
        id="file-upload" 
        multiple 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="sidebar-btn" style={{ textAlign: 'center', display: 'block' }}>
        {uploading ? '正在上传...' : '+ 上传照片'}
      </label>
    </div>
  );
}
