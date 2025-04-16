import { useState } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { FontCategory } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
}

const categories: { id: FontCategory; name: string }[] = [
  { id: 'all', name: '全部字体' },
  { id: 'sans-serif', name: '无衬线体' },
  { id: 'serif', name: '衬线体' },
  { id: 'monospace', name: '等宽字体' },
  { id: 'display', name: '展示字体' },
  { id: 'handwriting', name: '手写字体' },
  { id: 'custom', name: '其他字体' },
];

export default function Header({ onSearch, onCategoryChange, onRefresh }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FontCategory>('all');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleCategoryClick = (category: FontCategory) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">字体预览工具</h1>
          
          {/* 搜索框 */}
          <form onSubmit={handleSubmit} className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              className="input pr-10"
              placeholder="搜索字体..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
            >
              <FiSearch size={20} />
            </button>
          </form>
          
          {/* 刷新按钮 */}
          <button
            className="btn btn-secondary flex items-center justify-center"
            onClick={onRefresh}
            aria-label="刷新字体列表"
          >
            <FiRefreshCw className="mr-2" />
            刷新字体列表
          </button>
        </div>
        
        {/* 分类导航 */}
        <div className="mt-4 overflow-x-auto">
          <nav className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 