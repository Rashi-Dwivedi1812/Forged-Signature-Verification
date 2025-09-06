import React, { useState } from 'react';
import { Shield, FileText, GitCompare, Menu, X, Zap, Lock, Award, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import SinglePrediction from './components/SinglePrediction';
import ComparisonMode from './components/ComparisonMode';

function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'single',
      label: 'Single Analysis',
      icon: FileText,
      description: 'Analyze individual signature authenticity',
      color: 'from-emerald-400 to-blue-500'
    },
    {
      id: 'comparison',
      label: 'Compare Signatures',
      icon: GitCompare,
      description: 'Compare two signatures for verification',
      color: 'from-indigo-600 via-purple-600 to-pink-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get results in seconds with our advanced AI algorithms',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Your signatures are processed securely and never stored',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Award,
      title: '99.5% Accuracy',
      description: 'Industry-leading precision with deep learning models',
      color: 'from-blue-400 to-indigo-500'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Signatures Analyzed' },
    { number: '99.5%', label: 'Accuracy Rate' },
    { number: '<2s', label: 'Average Processing Time' },
    { number: '24/7', label: 'Available Always' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ForgedSignature
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block font-medium">Advanced AI Verification</p>
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 backdrop-blur-sm'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span className="hidden lg:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl hover:bg-gray-100/80 backdrop-blur-sm transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 py-6 backdrop-blur-lg">
              <div className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100/80'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-left">
                        <div className="text-base">{tab.label}</div>
                        <div className={`text-sm ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/25 relative">
            <Shield className="w-14 h-14 text-white" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Advanced Signature
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient">
              Verification
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Detect signature forgeries and verify authenticity using state-of-the-art AI technology. 
            <span className="font-semibold text-gray-700">Fast, accurate, and secure</span> signature analysis at your fingertips.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-12">
          {/* Tab Headers for Desktop */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-3 shadow-2xl border border-gray-200/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center space-x-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/25 scale-105`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <div className="text-left">
                      <div className="text-lg">{tab.label}</div>
                      <div className={`text-sm font-normal ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                    {activeTab !== tab.id && (
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="transition-all duration-500">
            {activeTab === 'single' && (
              <div className="animate-fadeIn">
                <SinglePrediction />
              </div>
            )}
            {activeTab === 'comparison' && (
              <div className="animate-fadeIn">
                <ComparisonMode />
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200/50">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Important Notice</h3>
              <div className="text-gray-600 space-y-4 leading-relaxed">
                <p className="text-lg">
                  This signature verification system uses advanced machine learning algorithms to analyze signature patterns and characteristics. 
                  While highly accurate, <span className="font-semibold text-gray-800">results should be used as a supplementary tool</span> alongside professional forensic analysis for critical applications.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm bg-emerald-50 text-emerald-700 rounded-xl px-4 py-3 font-medium">
                  <Lock className="w-4 h-4" />
                  <span>All uploaded images are processed locally and securely. No signature data is stored on our servers.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;