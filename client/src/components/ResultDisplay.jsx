import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Users, Clock, Download } from 'lucide-react';

function ResultDisplay({ result }) {
  if (!result) {
    return null;
  }

  // Helper function to format confidence/similarity as percentage
  const formatPercentage = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
      return value;
    }
    const numValue = parseFloat(value);
    return isNaN(numValue) ? '0%' : `${Math.round(numValue * 100)}%`;
  };

  // Helper function to get status info
  const getStatusInfo = (result) => {
    let isPositive = false;
    let statusText = '';
    let statusIcon = null;
    let statusColor = '';
    let bgColor = '';
    let borderColor = '';

    if (result.is_forged !== undefined) {
      // Single prediction result
      isPositive = !result.is_forged;
      statusText = result.is_forged ? 'Potential Forgery Detected' : 'Genuine Signature';
      statusIcon = result.is_forged ? XCircle : CheckCircle;
      statusColor = result.is_forged ? 'text-red-600' : 'text-green-600';
      bgColor = result.is_forged ? 'bg-red-50' : 'bg-green-50';
      borderColor = result.is_forged ? 'border-red-200' : 'border-green-200';
    } else if (result.is_match !== undefined) {
      // Comparison result
      isPositive = result.is_match;
      statusText = result.is_match ? 'Signatures Match' : 'Signatures Do Not Match';
      statusIcon = result.is_match ? CheckCircle : XCircle;
      statusColor = result.is_match ? 'text-green-600' : 'text-red-600';
      bgColor = result.is_match ? 'bg-green-50' : 'bg-red-50';
      borderColor = result.is_match ? 'border-green-200' : 'border-red-200';
    }

    return { isPositive, statusText, statusIcon: statusIcon, statusColor, bgColor, borderColor };
  };

  const { isPositive, statusText, statusIcon: StatusIcon, statusColor, bgColor, borderColor } = getStatusInfo(result);

  // Get confidence or similarity value
  const confidenceValue = result.confidence || result.similarity_score || 0;
  const confidenceLabel = result.confidence !== undefined ? 'Confidence Level' : 'Similarity Score';

  const handleDownloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      analysis_type: result.is_forged !== undefined ? 'Single Signature Analysis' : 'Signature Comparison',
      result: result,
      status: statusText
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signature-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-6 transition-all duration-300`}>
        {/* Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <StatusIcon className={`w-8 h-8 ${statusColor}`} />
            <div>
              <h3 className={`text-xl font-bold ${statusColor.replace('text-', 'text-').replace('-600', '-800')}`}>
                {statusText}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Analysis completed at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDownloadReport}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200"
            title="Download Report"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Confidence/Similarity Meter */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{confidenceLabel}:</span>
            <span className={`text-lg font-bold ${statusColor.replace('-600', '-700')}`}>
              {formatPercentage(confidenceValue)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  isPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min(parseFloat(confidenceValue) * 100 || 0, 100)}%` 
                }}
              ></div>
            </div>
            
            {/* Threshold Markers */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {(result.details || result.processing_time || result.model_version) && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Analysis Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {result.details && (
                <p className="leading-relaxed">{result.details}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-3">
                {result.processing_time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Processing: {result.processing_time}ms</span>
                  </div>
                )}
                
                {result.model_version && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Model: {result.model_version}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Result Interpretation
        </h4>
        
        <div className="text-sm text-gray-600 space-y-2">
          {result.is_forged !== undefined ? (
            // Single prediction interpretation
            <div className="space-y-1">
              <p><strong>Confidence levels:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>90-100%:</strong> Very high confidence in the result</li>
                <li><strong>70-89%:</strong> High confidence, reliable result</li>
                <li><strong>50-69%:</strong> Moderate confidence, consider additional verification</li>
                <li><strong>Below 50%:</strong> Low confidence, manual review recommended</li>
              </ul>
            </div>
          ) : (
            // Comparison interpretation
            <div className="space-y-1">
              <p><strong>Similarity scores:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>90-100%:</strong> Very high similarity, likely same person</li>
                <li><strong>70-89%:</strong> High similarity, probable match</li>
                <li><strong>50-69%:</strong> Moderate similarity, inconclusive</li>
                <li><strong>Below 50%:</strong> Low similarity, likely different signatures</li>
              </ul>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-3 italic">
            Note: This analysis is for reference purposes. For legal or critical decisions, 
            please consult with forensic handwriting experts.
          </p>
        </div>
      </div>

      {/* Raw Data (for debugging - can be removed in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Raw Response Data (Debug)
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default ResultDisplay;