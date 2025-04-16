'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FontList from '../components/FontList';
import UploadForm from '../components/UploadForm';
import PreviewTextSetting from '../components/PreviewTextSetting';
import { FontFile, FontFilter, FontSettings } from '../types';

// 默认预览文本
const DEFAULT_PREVIEW_TEXT = '汉字测试 ABCDEFG 1234567890';
// 默认字体大小
const DEFAULT_FONT_SIZE = 24;

export default function Home() {
  // 字体列表状态
  const [fonts, setFonts] = useState<FontFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 字体预览设置
  const [settings, setSettings] = useState<FontSettings>({
    previewText: DEFAULT_PREVIEW_TEXT,
    fontSize: DEFAULT_FONT_SIZE,
    fontColor: '#000000',
    backgroundColor: '#ffffff',
  });
  
  // 过滤设置
  const [filter, setFilter] = useState<FontFilter>({
    category: 'all',
    searchQuery: '',
    onlyFavorites: false,
  });
  
  // 上传状态
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // 加载字体列表
  const loadFonts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fonts');
      if (!response.ok) {
        throw new Error('加载字体列表失败');
      }
      const data = await response.json();
      setFonts(data.fonts);
      setError(null);
    } catch (err) {
      setError('无法加载字体列表，请刷新页面重试');
      console.error('Error loading fonts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadFonts();
  }, []);
  
  // 处理字体上传
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/fonts/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '上传失败');
      }
      
      setUploadSuccess(true);
      
      // 刷新字体列表
      await loadFonts();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : '字体上传失败');
    } finally {
      setIsUploading(false);
    }
  };
  
  // 更新预览文本
  const handlePreviewTextChange = (text: string) => {
    setSettings(prev => ({ ...prev, previewText: text }));
  };
  
  // 更新字体大小
  const handleFontSizeChange = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };
  
  // 处理搜索
  const handleSearch = (query: string) => {
    setFilter(prev => ({ ...prev, searchQuery: query }));
  };
  
  // 处理分类筛选
  const handleCategoryChange = (category: string) => {
    setFilter(prev => ({ ...prev, category: category as any }));
  };
  
  // 刷新字体列表
  const handleRefresh = () => {
    loadFonts();
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange}
        onRefresh={handleRefresh}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PreviewTextSetting 
            previewText={settings.previewText}
            fontSize={settings.fontSize}
            onPreviewTextChange={handlePreviewTextChange}
            onFontSizeChange={handleFontSizeChange}
          />
        </div>
        
        <div className="mb-8">
          <UploadForm 
            onUpload={handleUpload} 
            isUploading={isUploading}
            uploadSuccess={uploadSuccess}
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <FontList
          fonts={fonts}
          loading={loading}
          filter={filter}
          settings={settings}
          onRefresh={loadFonts}
        />
      </div>
    </main>
  );
} 