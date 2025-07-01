export interface AnalysisSection {
  snapshot?: {
    marketCap?: string;
    sharePrice?: string;
    targetPrice?: string;
    impliedUpside?: string;
    rating?: 'Buy' | 'Hold' | 'Sell';
    confidence?: 'High' | 'Medium' | 'Low';
  };
  keyMetrics?: {
    headers: string[];
    rows: string[][];
  };
  fundamentalDrivers?: {
    growthEngines?: string;
    costStructure?: string;
    capitalAllocation?: string;
  };
  thesisAssessment?: {
    supportingPoints?: string[];
    risks?: string[];
    netVerdict?: string;
  };
  macroSector?: {
    sectorCycle?: string;
    macroSensitivities?: string;
    competitiveMoat?: string;
  };
  catalystMap?: {
    headers: string[];
    rows: string[][];
  };
  scenarioAnalysis?: {
    headers: string[];
    rows: string[][];
  };
  investmentSummary?: {
    bullets?: string[];
    finalCall?: string;
  };
}

export interface APIRequest {
  companyName: string;
  symbol: string;
  apiKey: string;
  model: string;
}