export interface CompanyProfile {
  symbol: string;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface KeyMetrics {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  revenuePerShare: number;
  netIncomePerShare: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  shareholdersEquityPerShare: number;
  interestDebtPerShare: number;
  marketCap: number;
  enterpriseValue: number;
  peRatio: number;
  priceToSalesRatio: number;
  pocfratio: number;
  pfcfRatio: number;
  pbRatio: number;
  ptbRatio: number;
  evToSales: number;
  enterpriseValueOverEBITDA: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  earningsYield: number;
  freeCashFlowYield: number;
  debtToEquity: number;
  debtToAssets: number;
  netDebtToEBITDA: number;
  currentRatio: number;
  interestCoverage: number;
  incomeQuality: number;
  dividendYield: number;
  payoutRatio: number;
  salesGeneralAndAdministrativeToRevenue: number;
  researchAndDdevelopementToRevenue: number;
  intangiblesToTotalAssets: number;
  capexToOperatingCashFlow: number;
  capexToRevenue: number;
  capexToDepreciation: number;
  stockBasedCompensationToRevenue: number;
  grahamNumber: number;
  roic: number;
  returnOnTangibleAssets: number;
  grahamNetNet: number;
  workingCapital: number;
  tangibleAssetValue: number;
  netCurrentAssetValue: number;
  investedCapital: number;
  averageReceivables: number;
  averagePayables: number;
  averageInventory: number;
  daysSalesOutstanding: number;
  daysPayablesOutstanding: number;
  daysOfInventoryOnHand: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  roe: number;
  capexPerShare: number;
}

export interface FinancialStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
  link: string;
  finalLink: string;
}

export interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivites: number;
  netCashUsedForInvestingActivites: number;
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  link: string;
  finalLink: string;
}

export interface CompanyFinancialData {
  profile: CompanyProfile;
  quote: Quote;
  keyMetrics: KeyMetrics[];
  incomeStatements: FinancialStatement[];
  cashFlowStatements: CashFlowStatement[];
}

const FMP_API_KEY = 'a0Izxr8lhjLSAs5GYxX43v1eyg3EQ5j5';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Import testing mode functions
import { isTestingMode, mockSearchCompany, mockGetCompanyFinancialData } from './testingMode';

export async function searchCompany(query: string): Promise<{ symbol: string; name: string; }[]> {
  // Check if testing mode is enabled
  if (isTestingMode()) {
    return mockSearchCompany(query);
  }

  try {
    const response = await fetch(
      `${FMP_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name
    }));
  } catch (error) {
    console.error('Company search error:', error);
    throw new Error('Failed to search for company');
  }
}

export async function getCompanyFinancialData(symbol: string): Promise<CompanyFinancialData> {
  // Check if testing mode is enabled
  if (isTestingMode()) {
    return mockGetCompanyFinancialData(symbol);
  }

  try {
    // Fetch all data in parallel
    const [profileRes, quoteRes, keyMetricsRes, incomeRes, cashFlowRes] = await Promise.all([
      fetch(`${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`),
      fetch(`${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`),
      fetch(`${FMP_BASE_URL}/key-metrics/${symbol}?period=annual&limit=5&apikey=${FMP_API_KEY}`),
      fetch(`${FMP_BASE_URL}/income-statement/${symbol}?period=annual&limit=5&apikey=${FMP_API_KEY}`),
      fetch(`${FMP_BASE_URL}/cash-flow-statement/${symbol}?period=annual&limit=5&apikey=${FMP_API_KEY}`)
    ]);

    // Check if all requests were successful
    if (!profileRes.ok || !quoteRes.ok || !keyMetricsRes.ok || !incomeRes.ok || !cashFlowRes.ok) {
      throw new Error('Failed to fetch financial data');
    }

    // Parse all responses
    const [profile, quote, keyMetrics, incomeStatements, cashFlowStatements] = await Promise.all([
      profileRes.json(),
      quoteRes.json(),
      keyMetricsRes.json(),
      incomeRes.json(),
      cashFlowRes.json()
    ]);

    return {
      profile: profile[0],
      quote: quote[0],
      keyMetrics,
      incomeStatements,
      cashFlowStatements
    };
  } catch (error) {
    console.error('Financial data fetch error:', error);
    throw new Error('Failed to fetch financial data');
  }
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}