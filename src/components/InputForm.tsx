import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, Eye, EyeOff, Building2 } from 'lucide-react';

interface InputFormProps {
  onCompanySearch: (data: { companyName: string; symbol: string }) => void;
  onAnalysisRequest: (data: { apiKey: string; model: string }) => void;
  loadingCompany: boolean;
  loadingAnalysis: boolean;
  hasCompanyData: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ 
  onCompanySearch, 
  onAnalysisRequest, 
  loadingCompany, 
  loadingAnalysis,
  hasCompanyData 
}) => {
  const [companyQuery, setCompanyQuery] = useState('');
  const [apiKey, setApiKey] = useState('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');
  const [model, setModel] = useState('google/gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAnalysisSectionAnimated, setShowAnalysisSectionAnimated] = useState(false);
  const [autorunAI, setAutorunAI] = useState(true); // Default to checked
  
  // Renamed for clarity
  const companySearchAutorunExecuted = useRef(false);
  // New refs for analysis autorun
  const shouldTriggerAnalysisOnLoad = useRef(false);
  const analysisAutorunExecuted = useRef(false);

  // Check for URL parameters on component mount - only run once
  useEffect(() => {
    if (companySearchAutorunExecuted.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const sblParam = urlParams.get('sbl');
    const autorunParam = urlParams.get('autorun');
    
    if (sblParam) {
      setCompanyQuery(sblParam);
      companySearchAutorunExecuted.current = true;
      
      // Always trigger company search if sbl param is present
      setTimeout(() => {
        const symbolMatch = sblParam.match(/\(([^)]+)\)$/);
        const symbol = symbolMatch ? symbolMatch[1] : sblParam.trim().toUpperCase();
        const name = symbolMatch ? sblParam.replace(/\s*\([^)]+\)$/, '') : sblParam.trim();
        
        onCompanySearch({ 
          companyName: name, 
          symbol: symbol
        });
      }, 100);

      // Set flag to trigger analysis if autorun=yes
      if (autorunParam === 'yes') {
        shouldTriggerAnalysisOnLoad.current = true;
        setAutorunAI(true); // Also check the checkbox
      }
    }
  }, [onCompanySearch]);

  // New effect to handle analysis autorun after company data is loaded
  useEffect(() => {
    if (
      hasCompanyData && 
      (shouldTriggerAnalysisOnLoad.current || autorunAI) && 
      !analysisAutorunExecuted.current &&
      apiKey.trim()
    ) {
      analysisAutorunExecuted.current = true;
      
      // 720ms delay before triggering analysis
      setTimeout(() => {
        onAnalysisRequest({ 
          apiKey: apiKey.trim(), 
          model 
        });
      }, 720);
    }
  }, [hasCompanyData, autorunAI, apiKey, model, onAnalysisRequest]);

  // Effect to trigger animation when company data is available
  useEffect(() => {
    if (hasCompanyData) {
      const timer = setTimeout(() => {
        setShowAnalysisSectionAnimated(true);
      }, 666); // 666ms delay
      return () => clearTimeout(timer);
    } else {
      setShowAnalysisSectionAnimated(false); // Reset when company data is cleared
      analysisAutorunExecuted.current = false; // Reset autorun flag when starting fresh
    }
  }, [hasCompanyData]);

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyQuery.trim() && !loadingCompany) {
      // Reset autorun flag when manually submitting
      analysisAutorunExecuted.current = false;
      
      const symbolMatch = companyQuery.match(/\(([^)]+)\)$/);
      const symbol = symbolMatch ? symbolMatch[1] : companyQuery.trim().toUpperCase();
      const name = symbolMatch ? companyQuery.replace(/\s*\([^)]+\)$/, '') : companyQuery.trim();
      
      onCompanySearch({ 
        companyName: name, 
        symbol: symbol
      });
    }
  };

  const handleAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasCompanyData && !loadingAnalysis && apiKey.trim()) {
      onAnalysisRequest({ 
        apiKey: apiKey.trim(), 
        model 
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Step 1: Company Search */}
        <div className="rounded-xl p-6 shadow-2xl border border-custom-border" style={{ backgroundColor: '#000007' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-custom-accent" />
            Multi-step analysis:
          </h3>
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="company"
                  type="text"
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                  placeholder="Enter company name or symbol (e.g., Apple, AAPL)"
                  className="w-full pl-10 pr-4 py-3 bg-custom-darkest border border-custom-border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent"
                  required
                  disabled={loadingCompany}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingCompany || !companyQuery.trim()}
              className="w-full bg-custom-button hover:bg-custom-medium disabled:bg-custom-medium disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loadingCompany ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading....
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Retrieve data
                </>
              )}
            </button>

            {/* Autorun AI Analysis Toggle - Small and subtle */}
            <div className="flex items-center justify-center gap-1.5" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
              <button
                type="button"
                onClick={() => setAutorunAI(!autorunAI)}
                disabled={loadingCompany}
                className={`relative inline-flex h-3 w-5 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  autorunAI ? 'bg-custom-accent' : 'bg-slate-600'
                } ${loadingCompany ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform duration-200 ${
                    autorunAI ? 'translate-x-2.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <label 
                onClick={() => !loadingCompany && setAutorunAI(!autorunAI)}
                className={`text-xs text-slate-500 select-none ${loadingCompany ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Autorun AI
              </label>
            </div>
          </form>
        </div>

        {/* Step 2: AI Analysis - Only show after company data is loaded */}
        {hasCompanyData && (
          <div 
            className={`rounded-xl p-6 shadow-2xl border border-custom-border ${showAnalysisSectionAnimated ? 'animate-fadeInDown' : 'opacity-0'}`} 
            style={{ backgroundColor: '#000007' }}
          >
            <form onSubmit={handleAnalysisSubmit} className="space-y-4">
              
              <button
                type="submit"
                disabled={loadingAnalysis || !apiKey.trim()}
                style={{ 
                  backgroundColor: '#4169e1',
                  opacity: loadingAnalysis ? '0.66' : '1'
                }}
                className="w-full hover:bg-opacity-80 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loadingAnalysis ? (
                  <>
                    <img 
                      src="https://iu.com.au/wp-content/uploads/sites/4/2025/02/IUIQ-TGPT-logo-180x180-2.png" 
                      alt="AI Analysis" 
                      className="w-5 h-5 animate-pulse"
                    />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <img 
                      src="https://iu.com.au/wp-content/uploads/sites/4/2025/02/IUIQ-TGPT-logo-180x180-2.png" 
                      alt="AI Analysis" 
                      className="w-5 h-5"
                    />
                    IQ: Run AI Analysis
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Settings Cog - Fixed to bottom-left of entire page */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 hover:bg-custom-medium text-slate-400 hover:text-slate-300 rounded-full border border-custom-border shadow-lg transition-colors"
          style={{ backgroundColor: '#000007' }}
          disabled={loadingCompany || loadingAnalysis}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Advanced Settings Panel - Positioned above the cog */}
        {showSettings && (
          <div className="absolute bottom-16 left-0 w-80 rounded-xl border border-custom-border shadow-2xl" style={{ backgroundColor: '#000007' }}>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-2">
                  AI Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-custom-darkest border border-custom-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent"
                  disabled={loadingCompany || loadingAnalysis}
                >
                  <option value="google/gemini-2.5-Flash">Gemini 2.5 Flash</option>
                  <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="deepseek/deepseek-chat:free">DeepSeek</option>
                  <option value="deepseek/deepseek-r1-0528:free">DeepSeek R1</option>
                  <option value="openai/gpt-4.1-nano">GPT-4.1 Nano</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  DeepSeek R1 is free and provides excellent analysis quality
                </p>
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
                  OpenRouter API Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="w-full px-4 py-3 pr-12 bg-custom-darkest border border-custom-border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent"
                    disabled={loadingCompany || loadingAnalysis}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    disabled={loadingCompany || loadingAnalysis}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Required for AI analysis generation
                </p>
              </div>

              <div className="bg-custom-darkest rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Data Sources</h4>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span>Financial Modeling Prep API (Real-time data)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-custom-accent"></div>
                    <span>OpenRouter AI Models (Analysis)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};