import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, CheckCircle2, AlertCircle, Sparkles, Cloud } from 'lucide-react';

function FileUpload({ label, onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await simulateUpload(file);
    }
  };

  const simulateUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setSelectedFile(file);
    onFileSelect(file);
    setIsUploading(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await simulateUpload(file);
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
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    setSelectedFile(null);
    setUploadProgress(0);
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
        <div className="flex items-center space-x-2 mb-4">
          <label className="text-lg font-bold text-gray-800">
            {label}
          </label>
          <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Required
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Main Upload Container */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative cursor-pointer transition-all duration-300 overflow-hidden ${
            selectedFile
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg'
              : isDragOver
              ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-400 scale-[1.02] shadow-xl'
              : isUploading
              ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300'
              : 'bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:scale-[1.01] hover:shadow-lg'
          } rounded-2xl p-8 min-h-[200px] flex items-center justify-center`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-50"></div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {selectedFile ? (
            // File Selected State - Simple Clean Design
            <div className="w-full">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-green-300 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileImage className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Remove file"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          ) : isUploading ? (
            // Uploading State
            <div className="relative text-center w-full">
              <div className="mb-6">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                  <Cloud className="w-12 h-12 text-purple-600 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Uploading...</h3>
                <p className="text-sm text-purple-600">Processing your signature image</p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="bg-white/80 rounded-full p-1 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3 transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-purple-600 mt-2 font-medium">{uploadProgress}% Complete</p>
              </div>
            </div>
          ) : (
            // Upload State
            <div className="relative text-center w-full">
              <div className="mb-6">
                <div className={`mx-auto mb-4 p-4 rounded-2xl transition-all duration-300 ${
                  isDragOver 
                    ? 'bg-gradient-to-br from-blue-200 to-indigo-200 scale-110' 
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 hover:scale-105'
                }`}>
                  <Upload className={`w-12 h-12 transition-all duration-300 ${
                    isDragOver ? 'text-blue-700 animate-bounce' : 'text-blue-600'
                  }`} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {isDragOver ? 'Drop your signature here!' : 'Upload Signature Image'}
                  </h3>
                  <p className="text-base text-gray-600 font-medium">
                    {isDragOver ? 'Release to upload' : 'Drag & drop or click to browse'}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <div className="flex items-center justify-center mb-2">
                    <FileImage className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">PNG, JPG, JPEG</p>
                  <p className="text-xs text-gray-500">Supported formats</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Max 10MB</p>
                  <p className="text-xs text-gray-500">File size limit</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">High Quality</p>
                  <p className="text-xs text-gray-500">Clear images work best</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Drag Overlay Effect */}
          {isDragOver && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl border-2 border-blue-400 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <Upload className="w-16 h-16 text-blue-600 mx-auto animate-bounce" />
                <p className="text-lg font-bold text-blue-800 mt-2">Drop to Upload!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Floating Action Hint */}
        {!selectedFile && !isDragOver && !isUploading && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              Click or drag to upload
            </div>
          </div>
        )}
      </div>

      {/* Error State (can be uncommented when needed) */}
      {/* {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Upload Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default FileUpload;