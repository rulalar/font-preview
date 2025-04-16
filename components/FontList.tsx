import React from 'react';
import FontCard from './FontCard';
import { FontFile, FontFilter, FontSettings } from '../types';
import { FiLoader } from 'react-icons/fi';

interface FontListProps {
  fonts: FontFile[];
  loading: boolean;
  filter: FontFilter;
  settings: FontSettings;
  onRefresh: () => void;
}

export default function FontList({ 
  fonts, 
  loading, 
  filter, 
  settings,
  onRefresh,
}: FontListProps) {
  
  // 过滤字体
  const filteredFonts = React.useMemo(() => {
    return fonts.filter(font => {
      // 按名称搜索
      const matchesSearch = filter.searchQuery 
        ? font.displayName.toLowerCase().includes(filter.searchQuery.toLowerCase())
        : true;
      
      // 按分类过滤
      const matchesCategory = filter.category === 'all' 
        ? true 
        : (font.category === filter.category);
        
      return matchesSearch && matchesCategory;
    });
  }, [fonts, filter]);
  
  // 如果正在加载
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <FiLoader className="animate-spin text-primary mr-2" size={24} />
        <span className="text-gray-600">正在加载字体...</span>
      </div>
    );
  }

  // 如果没有字体
  if (fonts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow">
        <h3 className="text-xl font-medium text-gray-700 mb-2">没有找到字体</h3>
        <p className="text-gray-500 mb-4">请上传字体文件或将字体文件放入fonts目录</p>
        <button 
          className="btn btn-primary"
          onClick={onRefresh}
        >
          刷新字体列表
        </button>
      </div>
    );
  }
  
  // 如果没有匹配的字体
  if (filteredFonts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow">
        <h3 className="text-xl font-medium text-gray-700 mb-2">没有匹配的字体</h3>
        <p className="text-gray-500">请尝试其他搜索条件或分类</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFonts.map(font => (
        <FontCard 
          key={font.id} 
          font={font} 
          settings={settings}
        />
      ))}
    </div>
  );
} 