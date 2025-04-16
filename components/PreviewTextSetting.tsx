import React, { useState } from 'react';
import { FiRefreshCw, FiType } from 'react-icons/fi';

interface PreviewTextSettingProps {
  previewText: string;
  fontSize: number;
  onPreviewTextChange: (text: string) => void;
  onFontSizeChange: (size: number) => void;
}

export default function PreviewTextSetting({
  previewText,
  fontSize,
  onPreviewTextChange,
  onFontSizeChange,
}: PreviewTextSettingProps) {
  const [inputText, setInputText] = useState(previewText);
  
  // 常用预览文本选项
  const commonTexts = [
    '汉字测试 ABCDEFG 1234567890',
    '我能吞下玻璃而不伤身体',
    '敏捷的棕色狐狸跳过懒狗',
    '字体预览 The quick brown fox jumps over the lazy dog',
  ];
  
  // 处理文本输入变化
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  
  // 应用文本变化
  const handleApplyText = () => {
    onPreviewTextChange(inputText);
  };
  
  // 处理字体大小滑块变化
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };
  
  // 选择预设文本
  const handleSelectPreset = (text: string) => {
    setInputText(text);
    onPreviewTextChange(text);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <FiType className="mr-2" />
        预览文本设置
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* 预览文本输入 */}
        <div className="flex-1">
          <div className="flex mb-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="输入预览文本..."
              value={inputText}
              onChange={handleTextChange}
            />
            <button
              className="ml-2 btn btn-primary"
              onClick={handleApplyText}
            >
              应用
            </button>
          </div>
          
          {/* 常用预览文本选项 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {commonTexts.map((text, index) => (
              <button
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                onClick={() => handleSelectPreset(text)}
              >
                {text.length > 15 ? text.substring(0, 15) + '...' : text}
              </button>
            ))}
          </div>
        </div>
        
        {/* 字体大小滑块 */}
        <div className="md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            字体大小: {fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="72"
            step="1"
            value={fontSize}
            onChange={handleSizeChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12px</span>
            <span>72px</span>
          </div>
        </div>
      </div>
    </div>
  );
} 