import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { CompanyDetails } from './components/CompanyDetails';
import { AnalysisReport } from './components/AnalysisReport';
import TradingViewWidget from './components/TradingViewWidget';
import { generateAnalysis } from './services/openrouter';
import { getCompanyFinancialData, CompanyFinancialData } from './services/financialData';
import { AnalysisSection, APIRequest } from './types';
import { TrendingUp, AlertCircle, Database, BarChart3 } from 'lucide-react';

function App() {
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisSection | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [financialData, setFinancialData] = useState<CompanyFinancialData | null>(null);

  const handleCompanySearch = async (request: { companyName: string; symbol: string }) => {
    setLoadingCompany(true);
    setError(null);
    setAnalysis(null);
    setFinancialData(null);

    try {
      const companyData = await getCompanyFinancialData(request.symbol);
      setFinancialData(companyData);
      setCompanyName(request.companyName);
      setSymbol(request.symbol);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleAnalysisRequest = async (request: { model: string }) => {
    if (!financialData || !companyName || !symbol) return;

    setLoadingAnalysis(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await generateAnalysis(
        companyName, 
        symbol,
        financialData,
        request.model
      );
      
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title - Show when company data is loaded */}
        {financialData && companyName && (
          <h1 className="text-2xl font-bold text-white mb-8">
            {analysis ? `AI Analysis: ${companyName}` : `Company Overview: ${companyName}`}
          </h1>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Input Form - Fixed sidebar on large screens */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-8">
              <InputForm 
                onCompanySearch={handleCompanySearch} 
                onAnalysisRequest={handleAnalysisRequest}
                loadingCompany={loadingCompany}
                loadingAnalysis={loadingAnalysis}
                hasCompanyData={!!financialData}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="xl:col-span-3">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Error</h3>
                </div>
                <p className="text-red-200">{error}</p>
                <div className="mt-4 p-3 bg-red-950/50 rounded-lg">
                  <p className="text-sm text-red-300">
                    <strong>Troubleshooting:</strong><br />
                    • Verify the company symbol exists<br />
                    • Check your OpenRouter API key is correct<br />
                    • Ensure you have sufficient API credits<br />
                    • Try a different company or model
                  </p>
                </div>
              </div>
            )}

            {loadingCompany && (
              <div className="rounded-xl p-8 border border-custom-border text-center" style={{ backgroundColor: '#000007' }}>
                <div className="w-12 h-12 border-4 border-custom-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Loading Company Data</h3>
                <p className="text-slate-400">Fetching financial information and market data...</p>
              </div>
            )}

            {/* TradingView Chart - Show first when company data is loaded */}
            {financialData && !loadingCompany && (
              <div className="rounded-b-xl border border-custom-border mb-6 animate-fadeIn" style={{ backgroundColor: '#000007', height: "400px" }}>
                <TradingViewWidget 
                  symbol={symbol} 
                  exchange={financialData.profile.exchangeShortName || 'NASDAQ'} 
                />
              </div>
            )}

            {/* AI Analysis Loading - Show directly below chart when generating */}
            {loadingAnalysis && (
              <div className="rounded-xl p-8 border border-custom-border text-center mb-6" style={{ backgroundColor: '#000717' }}>
                <img 
                  src="https://iu.com.au/wp-content/uploads/sites/4/2025/02/IUIQ-TGPT-logo-180x180-2.png" 
                  alt="AI Analysis" 
                  className="w-12 h-12 mx-auto mb-4 animate-pulse"
                />
                <h3 className="text-lg font-semibold text-white mb-2">Generating AI Analysis</h3>
                <p className="text-slate-400">AI is analyzing the company and generating investment insights...</p>
                <p className="text-slate-500 text-sm mt-2">This may take up to 30 seconds...</p>
              </div>
            )}

            {/* AI Analysis Report - Show after generation */}
            {analysis && !loadingAnalysis && (
              <AnalysisReport analysis={analysis} companyName={companyName} />
            )}

            {/* Company Details - Show after chart and AI elements */}
            {financialData && !loadingCompany && (
              <div className="animate-fadeIn">
                <CompanyDetails 
                  financialData={financialData} 
                  companyName={companyName}
                  symbol={symbol}
                />
              </div>
            )}

            {/* Welcome State */}
            {!financialData && !loadingCompany && !error && (
              <div className="rounded-xl p-8 border border-custom-border text-center" style={{ backgroundColor: '#000007' }}>
                <h3 className="text-xl font-semibold text-white mb-2">Investment Analysis Tool</h3>
                <p className="text-slate-400 mb-6">
                  Enter a company name or ticker to begin your analysis journey
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-custom-darkest rounded-lg p-4">
                    <div className="text-custom-accent font-medium mb-1">Step 1</div>
                    <div className="text-slate-400">Load company financials & market data</div>
                  </div>
                  <div className="bg-custom-darkest rounded-lg p-4">
                    <div className="text-custom-accent font-medium mb-1">Step 2</div>
                    <div className="text-slate-400">Generate AI investment analysis</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;