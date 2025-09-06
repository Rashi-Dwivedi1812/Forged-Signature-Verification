import React, { useState, useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

function FileUpload({ label, onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer transition-all duration-200 ${
          selectedFile
            ? 'bg-green-50 border-2 border-green-300'
            : isDragOver
            ? 'bg-blue-100 border-2 border-blue-400 scale-105'
            : 'bg-gray-50 border-2 border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-300'
        } rounded-xl p-6`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {selectedFile ? (
          // File Selected State
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FileImage className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-green-600">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
            </button>
          </div>
        ) : (
          // Upload State
          <div className="text-center">
            <div className={`mx-auto mb-4 p-3 rounded-full ${
              isDragOver ? 'bg-blue-200' : 'bg-blue-100'
            }`}>
              <Upload className={`w-8 h-8 ${
                isDragOver ? 'text-blue-700' : 'text-blue-600'
              }`} />
            </div>
            
            <div className="space-y-2">
              <p className="text-base font-semibold text-gray-700">
                {isDragOver ? 'Drop your image here' : 'Upload signature image'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Supported formats: PNG, JPG, JPEG</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error handling could be added here */}
      {/* {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )} */}
    </div>
  );
}

export default FileUpload;