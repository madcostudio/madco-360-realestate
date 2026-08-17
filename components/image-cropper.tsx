'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface ImageCropperProps {
  imageSrc: string;
  onCropDone: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({ imageSrc, onCropDone, onCancel, aspectRatio = 16 / 9 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropDone(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg font-serif">Crop Image</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition">✕</button>
        </div>
        
        <div className="relative w-full h-[60vh] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-4 bg-slate-900 flex justify-between items-center border-t border-slate-800">
          <div className="flex items-center space-x-3 w-1/2">
            <span className="text-xs text-slate-400">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brass"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-brass hover:bg-brass-hover transition"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
