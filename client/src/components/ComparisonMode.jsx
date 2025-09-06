import React, { useState } from 'react';
import { GitCompare, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl">
            <GitCompare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Signature Comparison</h2>
            <p className="text-purple-100 text-sm">Compare two signatures for authenticity</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* First Signature */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Reference Signature</h3>
            </div>
            <FileUpload label="Upload genuine signature" onFileSelect={setFile1} />
            {file1 && <ImagePreview file={file1} />}
          </div>

          {/* Comparison Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <ArrowRight className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">VS</span>
            </div>
          </div>

          {/* Second Signature */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Test Signature</h3>
            </div>
            <FileUpload label="Upload signature to verify" onFileSelect={setFile2} />
            {file2 && <ImagePreview file={file2} />}
          </div>
        </div>

        {/* Mobile Comparison Indicator */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm font-medium">Compare</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleCompare}
            disabled={isLoading || !file1 || !file2}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading || !file1 || !file2
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Comparing...
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Signatures
              </>
            )}
          </button>

          {(file1 || file2 || result) && (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          )}
        </div>

        {/* Result Section */}
        <ResultDisplay result={result} />

        {/* Info Section */}
        {!file1 && !file2 && (
          <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">Comparison Process:</p>
                <ul className="space-y-1 text-purple-700">
                  <li>• Upload a reference signature (known genuine)</li>
                  <li>• Upload the signature you want to verify</li>
                  <li>• AI compares patterns, strokes, and characteristics</li>
                  <li>• Get similarity score and match results</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonMode;