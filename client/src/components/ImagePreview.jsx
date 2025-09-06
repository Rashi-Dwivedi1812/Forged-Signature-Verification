import React, { useState, useEffect } from 'react';
import { Eye, Download, RotateCw, ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react';

function ImagePreview({ file }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Cleanup URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
        setRotation(0);
        setZoom(1);
      };
    } else {
      setImageUrl(null);
    }
  }, [file]);

  if (!file || !imageUrl) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500 text-sm">No image selected</p>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          
          <span className="text-sm text-gray-600 font-medium min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative group">
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div 
            className="flex items-center justify-center p-4 bg-gray-50 min-h-[200px] max-h-[400px] overflow-auto relative"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt="Signature Preview"
                onClick={() => setIsFullscreen(true)}
                className="cursor-zoom-in transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  maxWidth: zoom > 1 ? 'none' : '100%',
                  maxHeight: zoom > 1 ? 'none' : '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 cursor-zoom-in">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-0 hover:scale-100 transition-transform duration-200">
                  <Maximize2 className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Image Info Bar */}
          <div className="px-4 py-4 bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 backdrop-blur-sm border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <Info className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 truncate max-w-[200px] text-sm">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium capitalize">
                        {file.type.split('/')[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={imageUrl}
              alt="Signature Preview - Fullscreen"
              className="max-w-full max-h-full object-contain"
              style={{ transform: `rotate(${rotation}deg)` }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;