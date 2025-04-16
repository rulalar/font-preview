import React, { useState, useRef } from 'react';
import { FiUpload, FiCheck, FiLoader } from 'react-icons/fi';

interface UploadFormProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadSuccess: boolean;
}

export default function UploadForm({ onUpload, isUploading, uploadSuccess }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // 处理文件上传
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };
  
  // 打开文件选择对话框
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 处理拖拽事件
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // 处理文件放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
        <FiUpload className="mr-2" />
        上传字体
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleOpenFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
        />
        
        <div className="space-y-2">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-600">
            将字体文件拖放到此处，或者
            <span className="text-primary font-medium cursor-pointer"> 点击浏览</span>
          </div>
          <p className="text-sm text-gray-500">
            支持 TTF, OTF, WOFF, WOFF2 格式
          </p>
        </div>
      </div>
      
      {selectedFile && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            
            <button
              className="btn btn-primary ml-3 flex items-center"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  上传中...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  上传字体
                </>
              )}
            </button>
          </div>
          
          {uploadSuccess && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <FiCheck className="mr-1" />
              字体上传成功，现在可以在列表中查看它
            </div>
          )}
        </div>
      )}
    </div>
  );
} 