import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '不支持的请求方法' });
  }

  try {
    const { fontName } = req.query;
    
    if (!fontName || typeof fontName !== 'string') {
      return res.status(400).json({ error: '缺少字体名称参数' });
    }
    
    // 构建字体文件的完整路径
    const fontPath = path.join(process.cwd(), 'public', 'fonts', fontName);
    
    // 检查文件是否存在
    if (!fs.existsSync(fontPath)) {
      return res.status(404).json({ error: '字体文件不存在' });
    }
    
    // 获取文件信息
    const stat = fs.statSync(fontPath);
    
    // 设置响应头，告诉浏览器这是一个可下载的文件
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fontName)}`);
    res.setHeader('Content-Length', stat.size);
    
    // 创建文件读取流并将其通过响应发送给客户端
    const fileStream = fs.createReadStream(fontPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('下载错误:', error);
    return res.status(500).json({ error: '字体文件下载失败' });
  }
} 