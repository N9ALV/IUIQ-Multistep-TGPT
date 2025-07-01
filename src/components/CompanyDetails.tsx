import React, { useState } from 'react';
import { CompanyFinancialData } from '../services/financialData';
import { 
  Building2, 
  Globe, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Percent,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CompanyDetailsProps {
  financialData: CompanyFinancialData;
  companyName: string;
  symbol: string;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ 
  financialData, 
  companyName, 
  symbol 
}) => {
  const { profile, quote, keyMetrics } = financialData;
  const latestMetrics = keyMetrics[0];
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Function to get truncated description (first 3 lines)
  const getTruncatedDescription = (text: string): string => {
    const sentences = text.split('. ');
    if (sentences.length <= 3) return text;
    return sentences.slice(0, 3).join('. ') + '.';
  };

  const shouldShowExpandButton = (text: string): boolean => {
    const sentences = text.split('. ');
    return sentences.length > 3;
  };

  // Prepare financial metrics data
  const financialMetrics = [
    { label: 'Market Cap', value: formatCurrency(quote.marketCap) },
    { label: 'P/E Ratio', value: quote.pe?.toFixed(1) || 'N/A' },
    { label: 'EPS', value: quote.eps ? `$${quote.eps.toFixed(2)}` : 'N/A' },
    { label: '52W High', value: `$${quote.yearHigh.toFixed(0)}` },
    { label: '52W Low', value: `$${quote.yearLow.toFixed(0)}` },
    { label: 'Volume', value: `${(quote.volume / 1e6).toFixed(1)}M` },
    ...(latestMetrics ? [
      { label: 'Revenue/Share', value: latestMetrics.revenuePerShare ? `$${latestMetrics.revenuePerShare.toFixed(1)}` : 'N/A' },
      { label: 'ROE', value: formatPercent(latestMetrics.roe || 0) },
      { label: 'ROIC', value: formatPercent(latestMetrics.roic || 0) },
      { label: 'Debt/Equity', value: latestMetrics.debtToEquity?.toFixed(1) || 'N/A' },
      { label: 'Current Ratio', value: latestMetrics.currentRatio?.toFixed(1) || 'N/A' },
      { label: 'FCF Yield', value: formatPercent(latestMetrics.freeCashFlowYield || 0) },
      { label: 'P/B Ratio', value: latestMetrics.pbRatio?.toFixed(1) || 'N/A' },
      { label: 'EV/EBITDA', value: latestMetrics.enterpriseValueOverEBITDA?.toFixed(1) || 'N/A' }
    ] : [])
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Company Header and Financial Overview - 60:40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company Header - 60% width (7/12 columns) */}
        <div className="lg:col-span-7 rounded-xl p-6 border border-custom-border" style={{ backgroundColor: '#000007' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{profile.companyName}</h2>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="font-mono text-lg">{symbol}</span>
                <span>{profile.exchangeShortName}</span>
                <span>{profile.sector}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${quote.price.toFixed(2)}</div>
              <div className={`text-lg ${quote.changesPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {quote.changesPercentage >= 0 ? '+' : ''}{quote.changesPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {/* Expandable Description */}
          <div className="relative mb-4">
            <p className="text-slate-300 leading-relaxed">
              {isDescriptionExpanded ? profile.description : getTruncatedDescription(profile.description)}
            </p>
            
            {shouldShowExpandButton(profile.description) && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 flex items-center gap-1 text-custom-accent hover:text-blue-400 transition-colors text-sm font-medium"
              >
                {isDescriptionExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More
                  </>
                )}
              </button>
            )}
          </div>

          {/* Company Details - Now in the 60% column with very small font */}
          <div className="pt-4 border-t border-custom-border">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">CEO:</span>
                <span className="text-slate-300 text-xs">{profile.ceo || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">Location:</span>
                <span className="text-slate-300 text-xs">{profile.city}, {profile.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">Employees:</span>
                <span className="text-slate-300 text-xs">{profile.fullTimeEmployees ? parseInt(profile.fullTimeEmployees).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">Industry:</span>
                <span className="text-slate-300 text-xs">{profile.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">IPO Date:</span>
                <span className="text-slate-300 text-xs">{profile.ipoDate || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-slate-500 text-xs">Website:</span>
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-custom-accent hover:text-blue-400 transition-colors text-xs"
                >
                  {profile.website?.replace('https://', '').replace('http://', '') || 'N/A'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview - 40% width (5/12 columns) */}
        <div className="lg:col-span-5 rounded-xl p-6 border border-custom-border" style={{ backgroundColor: '#000007' }}>
          <div className="grid grid-cols-1 gap-x-12">
            {financialMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-slate-800/20 last:border-b-0">
                <span className="text-slate-400 text-xs">{metric.label}</span>
                <span className="text-white font-medium text-xs">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};