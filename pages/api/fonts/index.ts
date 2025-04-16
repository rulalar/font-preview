import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { scanFonts } from '../../../utils/fontUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 字体文件目录
      const fontDir = path.join(process.cwd(), 'public', 'fonts');
      
      // 扫描字体文件
      const fonts = await scanFonts(fontDir);
      
      return res.status(200).json({ fonts });
    } catch (error) {
      console.error('Error fetching fonts:', error);
      return res.status(500).json({ error: '获取字体列表失败' });
    }
  } else {
    return res.status(405).json({ error: '不支持的请求方法' });
  }
} 