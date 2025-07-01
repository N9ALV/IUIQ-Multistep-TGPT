import React, { useState, useEffect } from 'react';
import { AnalysisSection } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2
} from 'lucide-react';

interface AnalysisReportProps {
  analysis: AnalysisSection;
  companyName: string;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis, companyName }) => {
  // State to track which sections should be visible
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  // Effect to sequentially show sections
  useEffect(() => {
    // Reset visible sections when analysis changes
    setVisibleSections(new Set());

    // Get all available sections
    const availableSections: number[] = [];
    if (analysis.snapshot) availableSections.push(1);
    if (analysis.keyMetrics) availableSections.push(2);
    if (analysis.fundamentalDrivers) availableSections.push(3);
    if (analysis.thesisAssessment) availableSections.push(4);
    if (analysis.macroSector) availableSections.push(5);
    if (analysis.catalystMap) availableSections.push(6);
    if (analysis.scenarioAnalysis) availableSections.push(7);
    if (analysis.investmentSummary) availableSections.push(8);

    // Sequentially show each section with 720ms delay
    availableSections.forEach((sectionNumber, index) => {
      setTimeout(() => {
        setVisibleSections(prev => new Set([...prev, sectionNumber]));
      }, index * 720);
    });
  }, [analysis]);

  const getRatingColor = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case 'buy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'hold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'sell': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const aiIcon = (
    <img 
      src="https://iu.com.au/wp-content/uploads/sites/4/2025/02/IUIQ-TGPT-logo-180x180-2.png" 
      alt="AI Analysis" 
      className="w-5 h-5"
    />
  );

  // Helper function to get section visibility class with z-index
  const getSectionClass = (sectionNumber: number) => {
    const isVisible = visibleSections.has(sectionNumber);
    // Use negative z-index values that decrease for later sections
    const zIndexStyle = { zIndex: 50 - sectionNumber };
    return {
      className: `${isVisible ? 'animate-fadeInDown' : 'opacity-0 translate-y-[-20px]'} transition-all duration-720 relative`,
      style: zIndexStyle
    };
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Snapshot Section */}
      {analysis.snapshot && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(1).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(1).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            1 | Snapshot
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rating - First */}
            {analysis.snapshot.rating && (
              <div className={`rounded-lg p-4 border ${getRatingColor(analysis.snapshot.rating)}`}>
                <div className="text-sm opacity-75">Rating</div>
                <div className="text-lg font-semibold">{analysis.snapshot.rating}</div>
              </div>
            )}
            {/* Confidence - Second */}
            {analysis.snapshot.confidence && (
              <div className="bg-custom-darkest rounded-lg p-4 border border-custom-border">
                <div className="text-sm text-slate-400">Confidence</div>
                <div className={`text-lg font-semibold ${getConfidenceColor(analysis.snapshot.confidence)}`}>
                  {analysis.snapshot.confidence}
                </div>
              </div>
            )}
            {/* Target Price - Third */}
            {analysis.snapshot.targetPrice && (
              <div className="bg-custom-darkest rounded-lg p-4">
                <div className="text-sm text-slate-400">Target Price</div>
                <div className="text-lg font-semibold text-white">{analysis.snapshot.targetPrice}</div>
              </div>
            )}
            {/* Upside Estimate - Fourth */}
            {analysis.snapshot.impliedUpside && (
              <div className="bg-custom-darkest rounded-lg p-4">
                <div className="text-sm text-slate-400">Upside Estimate</div>
                <div className="text-lg font-semibold text-green-400">{analysis.snapshot.impliedUpside}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics Section */}
      {analysis.keyMetrics && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(2).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(2).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            2 | Key Metrics & Valuation
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-custom-border">
                  {analysis.keyMetrics.headers.map((header, index) => (
                    <th key={index} className="text-left py-3 px-4 text-slate-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.keyMetrics.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-custom-medium">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4 text-white">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fundamental Drivers */}
      {analysis.fundamentalDrivers && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(3).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(3).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            3 | Fundamental Drivers
          </h2>
          <div className="space-y-4">
            {analysis.fundamentalDrivers.growthEngines && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Growth Engines</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.fundamentalDrivers.growthEngines}</p>
              </div>
            )}
            {analysis.fundamentalDrivers.costStructure && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Cost Structure</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.fundamentalDrivers.costStructure}</p>
              </div>
            )}
            {analysis.fundamentalDrivers.capitalAllocation && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Capital Allocation</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.fundamentalDrivers.capitalAllocation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thesis Assessment */}
      {analysis.thesisAssessment && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(4).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(4).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            4 | Thesis Assessment
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.thesisAssessment.supportingPoints && (
              <div>
                <h3 className="font-medium text-green-400 mb-3">Supporting Points</h3>
                <ul className="space-y-2">
                  {analysis.thesisAssessment.supportingPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.thesisAssessment.risks && (
              <div>
                <h3 className="font-medium text-red-400 mb-3">Risks</h3>
                <ul className="space-y-2">
                  {analysis.thesisAssessment.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {analysis.thesisAssessment.netVerdict && (
            <div className="mt-4 p-4 bg-custom-darkest rounded-lg border border-custom-border">
              <h3 className="font-medium text-slate-300 mb-2">Net Verdict</h3>
              <p className="text-white">{analysis.thesisAssessment.netVerdict}</p>
            </div>
          )}
        </div>
      )}

      {/* Macro & Sector Lens */}
      {analysis.macroSector && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(5).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(5).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            5 | Macro & Sector Lens
          </h2>
          <div className="space-y-4">
            {analysis.macroSector.sectorCycle && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Sector Cycle Position</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.macroSector.sectorCycle}</p>
              </div>
            )}
            {analysis.macroSector.macroSensitivities && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Macro Sensitivities</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.macroSector.macroSensitivities}</p>
              </div>
            )}
            {analysis.macroSector.competitiveMoat && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">Competitive Moat</h3>
                <p className="text-white bg-custom-darkest rounded-lg p-4">{analysis.macroSector.competitiveMoat}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Catalyst Map */}
      {analysis.catalystMap && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(6).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(6).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            6 | Catalyst Map
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-custom-border">
                  {analysis.catalystMap.headers.map((header, index) => (
                    <th key={index} className="text-left py-3 px-4 text-slate-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.catalystMap.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-custom-medium">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4 text-white">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scenario Analysis */}
      {analysis.scenarioAnalysis && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(7).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(7).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            7 | Scenario Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-custom-border">
                  {analysis.scenarioAnalysis.headers.map((header, index) => (
                    <th key={index} className="text-left py-3 px-4 text-slate-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.scenarioAnalysis.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-custom-medium">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4 text-white">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investment Summary */}
      {analysis.investmentSummary && (
        <div 
          className={`rounded-xl p-6 border border-custom-border ${getSectionClass(8).className}`} 
          style={{ backgroundColor: '#000717', ...getSectionClass(8).style }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {aiIcon}
            8 | Investment Summary
          </h2>
          {analysis.investmentSummary.bullets && (
            <ul className="space-y-2 mb-4">
              {analysis.investmentSummary.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-custom-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          {analysis.investmentSummary.finalCall && (
            <div className="bg-custom-accent/20 border border-custom-accent/30 rounded-lg p-4">
              <h3 className="font-medium text-custom-accent mb-2">Final Call</h3>
              <p className="text-white font-medium">{analysis.investmentSummary.finalCall}</p>
            </div>
          )}
        </div>
      )}

      {/* Separator line after AI Analysis */}
      <div className="border-t border-custom-border my-8"></div>
    </div>
  );
};