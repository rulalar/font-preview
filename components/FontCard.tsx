import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { FontFile, FontSettings } from '../types';

interface FontCardProps {
  font: FontFile;
  settings: FontSettings;
}

export default function FontCard({ font, settings }: FontCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 字体样式
  const fontStyle = {
    fontFamily: `"${font.displayName}", sans-serif`,
    fontSize: `${settings.fontSize}px`,
    color: settings.fontColor,
    backgroundColor: settings.backgroundColor,
  };
  
  // 处理下载
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/api/fonts/download?fontName=${encodeURIComponent(font.name)}`;
  };
  
  // 加载字体
  React.useEffect(() => {
    if (!isLoaded) {
      const fontFace = new FontFace(font.displayName, `url(${font.path})`);
      fontFace.load()
        .then((loadedFace) => {
          document.fonts.add(loadedFace);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error(`Error loading font ${font.displayName}:`, error);
        });
    }
  }, [font.displayName, font.path, isLoaded]);
  
  return (
    <div className="font-card">
      <div className="font-card-header">
        <h3 className="font-card-title">{font.displayName}</h3>
        <div className="flex">
          <button
            className="p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={handleDownload}
            title="下载字体"
          >
            <FiDownload size={18} />
          </button>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {font.format.toUpperCase()} 格式
        </p>
      </div>
      
      <div 
        className="font-card-preview"
        style={fontStyle}
      >
        {isLoaded ? settings.previewText : '加载中...'}
      </div>
    </div>
  );
} 