import React, { useState } from 'react';
import { GitCompare, ArrowRight, AlertCircle, RotateCcw, Sparkles, Shield, Zap } from 'lucide-react';
import FileUpload from './FileUpload';
import ImagePreview from './ImagePreview';
import ResultDisplay from './ResultDisplay';

function ComparisonMode() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) {
      alert('Please upload both signature images.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch('http://localhost:8000/api/compare-signatures', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error during comparison:', error);
      alert('Failed to get comparison from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modern Card Container with Glass Effect */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]"></div>
        
        {/* Header with Enhanced Design */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <GitCompare className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-yellow-800" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">AI Signature Comparison</h2>
                <p className="text-purple-100 text-base">Advanced authentication with machine learning</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="hidden md:flex space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm text-white font-medium">Secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-white font-medium">Fast AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="relative p-8 lg:p-12">
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 bg-gray-100 rounded-full p-2">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                file1 ? 'bg-green-500 text-white' : 'bg-white text-gray-600'
              }`}>
                <span className="text-sm font-medium">1. Upload Reference</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                file2 ? 'bg-green-500 text-white' : 'bg-white text-gray-600'
              }`}>
                <span className="text-sm font-medium">2. Upload Test</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                result ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'
              }`}>
                <span className="text-sm font-medium">3. Compare</span>
              </div>
            </div>
          </div>

          {/* Upload Section with Enhanced Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
            {/* First Signature */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Reference Signature</h3>
                  <p className="text-sm text-gray-500">Upload the authentic signature</p>
                </div>
              </div>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <FileUpload label="Upload genuine signature" onFileSelect={setFile1} />
              </div>
              {file1 && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <ImagePreview file={file1} />
                </div>
              )}
            </div>

            {/* Enhanced Comparison Indicator */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <GitCompare className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    VS
                  </span>
                  <p className="text-sm text-gray-500 mt-1">AI Analysis</p>
                </div>
              </div>
            </div>

            {/* Second Signature */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Test Signature</h3>
                  <p className="text-sm text-gray-500">Upload signature to verify</p>
                </div>
              </div>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <FileUpload label="Upload signature to verify" onFileSelect={setFile2} />
              </div>
              {file2 && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <ImagePreview file={file2} />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <button
              onClick={handleCompare}
              disabled={isLoading || !file1 || !file2}
              className={`group relative flex-1 flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
                isLoading || !file1 || !file2
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {!isLoading && (file1 && file2) && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              
              <div className="relative flex items-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                    <span>Analyzing Signatures...</span>
                    <div className="ml-3 flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <GitCompare className="w-6 h-6 mr-3" />
                    <span>Compare Signatures</span>
                    <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
                  </>
                )}
              </div>
            </button>

            {(file1 || file2 || result) && (
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Result Section */}
          <ResultDisplay result={result} />

          {/* Enhanced Info Section */}
          {!file1 && !file2 && (
            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl opacity-60"></div>
              <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">How It Works</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                          <span className="font-semibold text-gray-700">Upload reference signature (authentic)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                          <span className="font-semibold text-gray-700">Upload signature to be verified</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                          <span className="font-semibold text-gray-700">AI analyzes patterns & characteristics</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                          <span className="font-semibold text-gray-700">Get detailed similarity results</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                      <div className="flex items-center space-x-2 text-indigo-700">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">Secure Processing:</span>
                        <span className="text-indigo-600">Your images are processed securely and never stored permanently</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComparisonMode;