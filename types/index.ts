// 字体文件类型
export interface FontFile {
  id: string;          // 唯一ID
  name: string;        // 字体名称
  path: string;        // 文件路径
  category?: string;   // 字体分类 (如 Sans Serif, Serif, 等)
  format: string;      // 字体格式 (如 ttf, woff, woff2)
  displayName: string; // 显示名称
  isFavorite: boolean; // 是否收藏
  dateAdded: string;   // 添加日期
  previewText?: string; // 预览文本
}

// 字体设置
export interface FontSettings {
  previewText: string;   // 默认预览文本
  fontSize: number;      // 字体大小 (px)
  fontColor: string;     // 字体颜色
  backgroundColor: string; // 背景颜色
}

// 字体分类
export type FontCategory = 'all' | 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting' | 'favorites' | 'custom';

// 字体过滤器
export interface FontFilter {
  category: FontCategory;
  searchQuery: string;
  onlyFavorites: boolean;
} 