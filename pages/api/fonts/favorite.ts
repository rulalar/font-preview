import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { saveFavorites } from '../../../utils/fontUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fontName, isFavorite } = req.body;
      
      if (!fontName) {
        return res.status(400).json({ error: '缺少字体名称参数' });
      }
      
      // 读取当前收藏列表
      const favoritesPath = path.join(process.cwd(), 'public', 'favorites.json');
      let favorites: Record<string, boolean> = {};
      
      if (fs.existsSync(favoritesPath)) {
        try {
          const data = fs.readFileSync(favoritesPath, 'utf8');
          favorites = JSON.parse(data);
        } catch (err) {
          console.error('Error reading favorites:', err);
        }
      }
      
      // 更新收藏状态
      favorites[fontName] = !!isFavorite;
      
      // 保存更新后的收藏列表
      saveFavorites(favorites);
      
      return res.status(200).json({ success: true, message: '收藏状态已更新' });
    } catch (error) {
      console.error('Error updating favorite status:', error);
      return res.status(500).json({ error: '更新收藏状态失败' });
    }
  } else {
    return res.status(405).json({ error: '不支持的请求方法' });
  }
} 