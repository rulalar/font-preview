import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

// 配置 API 路由不使用默认的 body 解析，以支持文件上传
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不支持的请求方法' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'fonts'),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 最大 50MB
    });

    // 解析表单数据，包括上传的文件
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('文件上传错误:', err);
        return res.status(500).json({ error: '文件上传失败' });
      }

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: '未找到上传的文件' });
      }

      // 检查文件是否为有效的字体文件
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      const fileExt = path.extname(file.originalFilename || '').toLowerCase();
      
      if (!validExtensions.includes(fileExt)) {
        // 删除无效文件
        fs.unlinkSync(file.filepath);
        return res.status(400).json({ error: '不支持的字体文件格式' });
      }

      // 重命名文件，使用原始文件名
      const newPath = path.join(
        process.cwd(),
        'public',
        'fonts',
        file.originalFilename || `font-${Date.now()}${fileExt}`
      );

      // 如果同名文件已存在，先删除
      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }

      // 移动文件到最终位置
      fs.renameSync(file.filepath, newPath);

      return res.status(200).json({
        success: true,
        message: '字体文件上传成功',
        fontName: file.originalFilename,
      });
    });
  } catch (error) {
    console.error('上传处理错误:', error);
    return res.status(500).json({ error: '文件上传处理失败' });
  }
} 