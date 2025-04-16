/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 配置允许保存上传的字体文件到公共目录
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
  // 支持中文路径
  assetPrefix: './',
  // 增加 API 超时时间，用于大文件上传
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

module.exports = nextConfig; 