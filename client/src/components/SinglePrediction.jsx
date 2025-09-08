import React, { useState } from 'react';
import { Shield, Upload, AlertCircle, RotateCcw, Sparkles, Zap, Brain, CheckCircle2, FileImage } from 'lucide-react';
import FileUpload from './FileUpload';
import ImagePreview from './ImagePreview';
import ResultDisplay from './ResultDisplay';

function SinglePrediction() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) {
      alert('Please upload a signature image first.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
  const response = await fetch('http://localhost:8000/api/predict-single', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  setResult(data);
} catch (error) {
  console.error('Error during prediction:', error);
  alert('Failed to get prediction from the server.');
} finally {
  setIsLoading(false);
}
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Modern Card Container with Glass Effect */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        
        {/* Header with Enhanced Design */}
        <div className="relative bg-gradient-to-r from-emerald-400 to-blue-500 px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-2 h-2 text-green-800" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">AI Signature Analysis</h2>
                <p className="text-blue-100 text-base">Advanced authenticity detection powered by machine learning</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="hidden md:flex space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Brain className="w-4 h-4 text-green-300" />
                <span className="text-sm text-white font-medium">AI Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-white font-medium">Instant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="relative p-8 lg:p-12">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 bg-gray-100 rounded-full p-2">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                file ? 'bg-green-500 text-white' : 'bg-white text-gray-600'
              }`}>
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                result ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
              }`}>
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">Analyze</span>
              </div>
            </div>
          </div>

          {/* Upload Section with Enhanced Design */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2 mb-3">
                <FileImage className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Step 1: Upload Your Signature</span>
              </div>
              <p className="text-gray-600">Select a clear image of the signature you want to analyze</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <FileUpload label="Upload Signature" onFileSelect={setFile} />
              </div>
            </div>
          </div>

          {/* Preview Section with Animation */}
          {file && (
            <div className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Step 2: Review Your Upload</span>
                </div>
                <p className="text-gray-600">Image uploaded successfully - ready for analysis</p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <ImagePreview file={file} />
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-12 max-w-2xl mx-auto">
            <button
              onClick={handlePredict}
              disabled={isLoading || !file}
              className={`group relative flex-1 flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
                isLoading || !file
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {!isLoading && file && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              
              <div className="relative flex items-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                    <span>Analyzing Signature...</span>
                    <div className="ml-3 flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6 mr-3" />
                    <span>Analyze Signature</span>
                    <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
                  </>
                )}
              </div>
            </button>

            {(file || result) && (
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Result Section */}
          <ResultDisplay result={result} />

          {/* Enhanced Info Section */}
          {!file && (
            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-3xl opacity-60"></div>
              <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">How AI Analysis Works</h4>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-700 text-lg">Analysis Process</h5>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <span className="font-medium text-gray-700">Upload clear signature image</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <span className="font-medium text-gray-700">AI processes stroke patterns</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <span className="font-medium text-gray-700">Get authenticity assessment</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-700 text-lg">Features</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600">Advanced pattern recognition</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600">Instant results in seconds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600">Multiple image formats</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600">High accuracy analysis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">Secure Processing:</span>
                        <span className="text-blue-600">Your signature images are processed securely and never stored</span>
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

export default SinglePrediction;