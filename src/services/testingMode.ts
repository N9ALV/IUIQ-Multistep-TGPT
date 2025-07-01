import { mockTeslaData, mockTeslaAnalysis } from './mockData';
import { CompanyFinancialData } from './financialData';
import { AnalysisSection } from '../types';

// **TESTING MODE CONFIGURATION**
// Set this to true to enable testing mode with mock data
// Set this to false to use live APIs
export const TESTING_MODE = false;

// Mock company search for testing
export async function mockSearchCompany(query: string): Promise<{ symbol: string; name: string; }[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (query.toLowerCase().includes('tesla') || query.toLowerCase().includes('tsla')) {
    return [{ symbol: 'TSLA', name: 'Tesla, Inc.' }];
  }
  
  // Return some other mock companies for testing
  return [
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' }
  ];
}

// Mock financial data fetch for testing
export async function mockGetCompanyFinancialData(symbol: string): Promise<CompanyFinancialData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For testing, always return TSLA data regardless of symbol
  return mockTeslaData;
}

// Mock analysis generation for testing
export async function mockGenerateAnalysis(
  companyName: string,
  symbol: string,
  financialData: CompanyFinancialData,
  apiKey: string,
  model: string
): Promise<AnalysisSection> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For testing, always return TSLA analysis
  return mockTeslaAnalysis;
}

// Helper function to check if testing mode is enabled
export function isTestingMode(): boolean {
  return TESTING_MODE;
}

// Helper function to get testing status message
export function getTestingModeMessage(): string {
  return TESTING_MODE 
    ? "🧪 TESTING MODE ACTIVE - Using mock TSLA data" 
    : "🔴 LIVE MODE - Using real APIs";
}