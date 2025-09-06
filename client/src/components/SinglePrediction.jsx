import React, { useState } from 'react';
import { Shield, Upload, AlertCircle } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Single Signature Analysis</h2>
            <p className="text-blue-100 text-sm">Upload and analyze signature authenticity</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload label="Upload Signature" onFileSelect={setFile} />
        </div>

        {/* Preview Section */}
        {file && (
          <div className="mb-8">
            <ImagePreview file={file} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handlePredict}
            disabled={isLoading || !file}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Analyze Signature
              </>
            )}
          </button>

          {(file || result) && (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
          )}
        </div>

        {/* Result Section */}
        <ResultDisplay result={result} />

        {/* Info Section */}
        {!file && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Upload a clear image of the signature to analyze</li>
                  <li>• Our AI model will process the signature patterns</li>
                  <li>• Get instant results on signature authenticity</li>
                  <li>• Supported formats: PNG, JPG, JPEG</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SinglePrediction;