import fs from 'fs';
import path from 'path';
import { FontFile } from '../types';

// 获取字体文件扩展名
export function getFontFormat(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext.substring(1); // 移除点号
}

// 从字体文件名提取字体名称
export function extractFontName(filename: string): string {
  // 移除扩展名
  let name = path.basename(filename, path.extname(filename));
  
  // 替换下划线和连字符为空格
  name = name.replace(/[_-]/g, ' ');
  
  // 首字母大写
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return name;
}

// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// 从系统字体文件夹读取所有字体
export async function scanFonts(fontDir: string): Promise<FontFile[]> {
  // 确保字体目录存在
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(fontDir);
    
    // 过滤出字体文件
    const fontExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const fontFiles = files.filter(file => 
      fontExtensions.includes(path.extname(file).toLowerCase())
    );
    
    // 读取保存的收藏夹信息
    let favorites: Record<string, boolean> = {};
    const favoritesPath = path.join(process.cwd(), 'public', 'favorites.json');
    
    if (fs.existsSync(favoritesPath)) {
      try {
        const data = fs.readFileSync(favoritesPath, 'utf8');
        favorites = JSON.parse(data);
      } catch (err) {
        console.error('Error reading favorites:', err);
      }
    }
    
    // 处理每个字体文件
    return fontFiles.map(file => {
      const id = generateId();
      const filePath = path.join(fontDir, file);
      const format = getFontFormat(file);
      const displayName = extractFontName(file);
      
      // 检查此字体是否被收藏
      const isFavorite = favorites[file] || false;
      
      return {
        id,
        name: file,
        path: `/fonts/${file}`,
        format,
        displayName,
        isFavorite,
        dateAdded: new Date().toISOString(),
      } as FontFile;
    });
  } catch (err) {
    console.error('Error scanning fonts:', err);
    return [];
  }
}

// 保存收藏夹信息
export function saveFavorites(favorites: Record<string, boolean>): void {
  const favoritesPath = path.join(process.cwd(), 'public', 'favorites.json');
  try {
    fs.writeFileSync(favoritesPath, JSON.stringify(favorites, null, 2));
  } catch (err) {
    console.error('Error saving favorites:', err);
  }
}

// 简单的字体分类识别（基于文件名）
export function detectFontCategory(fontName: string): string {
  const lowerName = fontName.toLowerCase();
  
  if (lowerName.includes('sans') || lowerName.includes('gothic')) {
    return 'sans-serif';
  } else if (lowerName.includes('serif') || lowerName.includes('roman')) {
    return 'serif';
  } else if (lowerName.includes('mono') || lowerName.includes('console')) {
    return 'monospace';
  } else if (lowerName.includes('script') || lowerName.includes('hand') || lowerName.includes('brush')) {
    return 'handwriting';
  } else if (lowerName.includes('display') || lowerName.includes('deco')) {
    return 'display';
  } else {
    return 'custom';
  }
} 