import { AnalysisSection } from '../types';
import { CompanyFinancialData } from './financialData';
import { isTestingMode, mockGenerateAnalysis } from './testingMode';

const ANALYSIS_PROMPT = `## ROLE
You are a **senior buy-side equity analyst** at a Tier-1 investment fund. Your analysis will be processed by software, so strict adherence to the format is crucial.

## INPUT
Company: {COMPANY_NAME}
Symbol: {SYMBOL}

## OUTPUT FORMAT REQUIREMENTS
- Use ONLY plain text, no markdown formatting
- Use consistent section headers exactly as shown
- Use pipe (|) separators for tables
- Use simple bullet points with dashes (-)
- No bold, italic, or other formatting
- Keep responses concise and data-focused

## ANALYSIS STRUCTURE

SECTION_1_SNAPSHOT
Market Cap: [value]
Share Price: [value]
Target Price: [value]
Upside Estimate: [value]
Rating: [Buy/Hold/Sell]
Confidence: [High/Medium/Low]

SECTION_2_KEY_METRICS
Metric|TTM|3-yr CAGR|Sector Median|Delta vs Median
Revenue growth|[value]|[value]|[value]|[value]
Gross margin|[value]|[value]|[value]|[value]
FCF margin|[value]|[value]|[value]|[value]
P/E (NTM)|[value]|[value]|[value]|[value]
EV/EBITDA (NTM)|[value]|[value]|[value]|[value]

SECTION_3_FUNDAMENTAL_DRIVERS
Growth Engines: [single paragraph description]
Cost Structure: [single paragraph description]
Capital Allocation: [single paragraph description]

SECTION_4_THESIS_ASSESSMENT
Supporting Points:
- [point 1]
- [point 2]
- [point 3]
Risks:
- [risk 1]
- [risk 2]
Net Verdict: [Bullish/Bearish/Neutral] - [single sentence justification]

SECTION_5_MACRO_SECTOR
Sector Cycle: [single paragraph description]
Macro Sensitivities: [single paragraph description]
Competitive Moat: [single paragraph description]

SECTION_6_CATALYST_MAP
Date/Window|Event|Expected Impact|ST/LT
[date]|[event]|[impact]|[timeframe]
[date]|[event]|[impact]|[timeframe]
[date]|[event]|[impact]|[timeframe]

SECTION_7_SCENARIO_ANALYSIS
Case|Assumptions|Valuation|Probability|Price Target
Bear|[assumptions]|[valuation]|[probability]|[target]
Base|[assumptions]|[valuation]|[probability]|[target]
Bull|[assumptions]|[valuation]|[probability]|[target]
Risk-reward|Probability-weighted upside|[value]|100%|[weighted target]

SECTION_8_INVESTMENT_SUMMARY
Key Points:
- [bullet 1]
- [bullet 2]
- [bullet 3]
- [bullet 4]
- [bullet 5]
Final Call: [Buy/Hold/Sell], [timeframe], [confidence level]`;

export async function generateAnalysis(
  companyName: string,
  symbol: string,
  financialData: CompanyFinancialData,
  apiKey: string,
  model: string
): Promise<AnalysisSection> {
  // Check if testing mode is enabled
  if (isTestingMode()) {
    return mockGenerateAnalysis(companyName, symbol, financialData, apiKey, model);
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Investment Analysis Tool',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial analyst. Respond with plain text only, following the exact format provided. Do not use markdown, bold, italic, or any formatting. Use simple text with consistent structure.'
        },
        {
          role: 'user',
          content: ANALYSIS_PROMPT
            .replace('{COMPANY_NAME}', companyName)
            .replace('{SYMBOL}', symbol)
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No analysis content received from API');
  }

  return parseStructuredAnalysis(content);
}

function parseStructuredAnalysis(content: string): AnalysisSection {
  const analysis: AnalysisSection = {};

  try {
    // Parse Snapshot section
    const snapshotSection = extractSection(content, 'SECTION_1_SNAPSHOT');
    if (snapshotSection) {
      analysis.snapshot = {
        marketCap: extractKeyValue(snapshotSection, 'Market Cap'),
        sharePrice: extractKeyValue(snapshotSection, 'Share Price'),
        targetPrice: extractKeyValue(snapshotSection, 'Target Price'),
        impliedUpside: extractKeyValue(snapshotSection, 'Upside Estimate'),
        rating: extractKeyValue(snapshotSection, 'Rating') as 'Buy' | 'Hold' | 'Sell',
        confidence: extractKeyValue(snapshotSection, 'Confidence') as 'High' | 'Medium' | 'Low',
      };
    }

    // Parse Key Metrics section
    const metricsSection = extractSection(content, 'SECTION_2_KEY_METRICS');
    if (metricsSection) {
      const table = parseSimpleTable(metricsSection);
      if (table.headers.length > 0) {
        analysis.keyMetrics = table;
      }
    }

    // Parse Fundamental Drivers section
    const driversSection = extractSection(content, 'SECTION_3_FUNDAMENTAL_DRIVERS');
    if (driversSection) {
      analysis.fundamentalDrivers = {
        growthEngines: extractKeyValue(driversSection, 'Growth Engines'),
        costStructure: extractKeyValue(driversSection, 'Cost Structure'),
        capitalAllocation: extractKeyValue(driversSection, 'Capital Allocation'),
      };
    }

    // Parse Thesis Assessment section
    const thesisSection = extractSection(content, 'SECTION_4_THESIS_ASSESSMENT');
    if (thesisSection) {
      analysis.thesisAssessment = {
        supportingPoints: extractBulletList(thesisSection, 'Supporting Points:'),
        risks: extractBulletList(thesisSection, 'Risks:'),
        netVerdict: extractKeyValue(thesisSection, 'Net Verdict'),
      };
    }

    // Parse Macro & Sector section
    const macroSection = extractSection(content, 'SECTION_5_MACRO_SECTOR');
    if (macroSection) {
      analysis.macroSector = {
        sectorCycle: extractKeyValue(macroSection, 'Sector Cycle'),
        macroSensitivities: extractKeyValue(macroSection, 'Macro Sensitivities'),
        competitiveMoat: extractKeyValue(macroSection, 'Competitive Moat'),
      };
    }

    // Parse Catalyst Map section
    const catalystSection = extractSection(content, 'SECTION_6_CATALYST_MAP');
    if (catalystSection) {
      const table = parseSimpleTable(catalystSection);
      if (table.headers.length > 0) {
        analysis.catalystMap = table;
      }
    }

    // Parse Scenario Analysis section
    const scenarioSection = extractSection(content, 'SECTION_7_SCENARIO_ANALYSIS');
    if (scenarioSection) {
      const table = parseSimpleTable(scenarioSection);
      if (table.headers.length > 0) {
        analysis.scenarioAnalysis = table;
      }
    }

    // Parse Investment Summary section
    const summarySection = extractSection(content, 'SECTION_8_INVESTMENT_SUMMARY');
    if (summarySection) {
      analysis.investmentSummary = {
        bullets: extractBulletList(summarySection, 'Key Points:'),
        finalCall: extractKeyValue(summarySection, 'Final Call'),
      };
    }

  } catch (error) {
    console.warn('Error parsing structured analysis, falling back to legacy parser:', error);
    // Fallback to legacy parsing if structured parsing fails
    return parseLegacyAnalysis(content);
  }

  return analysis;
}

function extractSection(content: string, sectionHeader: string): string | null {
  const regex = new RegExp(`${sectionHeader}([\\s\\S]*?)(?=SECTION_\\d+_|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function extractKeyValue(section: string, key: string): string | undefined {
  const regex = new RegExp(`${key}:\\s*(.+)`, 'i');
  const match = section.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractBulletList(section: string, header: string): string[] {
  const headerIndex = section.toLowerCase().indexOf(header.toLowerCase());
  if (headerIndex === -1) return [];
  
  const afterHeader = section.substring(headerIndex + header.length);
  const lines = afterHeader.split('\n');
  const bullets: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
      bullets.push(trimmed.substring(1).trim());
    } else if (trimmed && !trimmed.includes(':') && bullets.length > 0) {
      // Stop if we hit another section
      break;
    }
  }
  
  return bullets;
}

function parseSimpleTable(section: string): { headers: string[]; rows: string[][] } {
  const lines = section.split('\n').filter(line => line.trim() && line.includes('|'));
  
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
  const rows = lines.slice(1).map(line => 
    line.split('|').map(cell => cell.trim()).filter(cell => cell)
  ).filter(row => row.length > 0);
  
  return { headers, rows };
}

// Legacy parser as fallback
function parseLegacyAnalysis(content: string): AnalysisSection {
  const analysis: AnalysisSection = {};

  // Parse Snapshot section
  const snapshotMatch = content.match(/1 \| Snapshot([\s\S]*?)(?=2 \| Key Metrics|$)/i);
  if (snapshotMatch) {
    const snapshotText = snapshotMatch[1];
    analysis.snapshot = {
      marketCap: extractValue(snapshotText, /mkt cap[:\s]*([^\n]+)/i),
      sharePrice: extractValue(snapshotText, /share price[:\s]*([^\n]+)/i),
      targetPrice: extractValue(snapshotText, /target price[:\s]*([^\n]+)/i),
      impliedUpside: extractValue(snapshotText, /upside estimate[:\s]*([^\n]+)/i),
      rating: extractRating(snapshotText),
      confidence: extractConfidence(snapshotText),
    };
  }

  // Parse Key Metrics section
  const metricsMatch = content.match(/2 \| Key Metrics[^\n]*\n([\s\S]*?)(?=3 \| Fundamental|$)/i);
  if (metricsMatch) {
    const tableText = metricsMatch[1];
    const parsedTable = parseTable(tableText);
    if (parsedTable.headers.length > 0) {
      analysis.keyMetrics = parsedTable;
    }
  }

  // Continue with other sections...
  return analysis;
}

function extractValue(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractRating(text: string): 'Buy' | 'Hold' | 'Sell' | undefined {
  const ratingMatch = text.match(/rating[:\s]*(buy|hold|sell)/i);
  return ratingMatch ? (ratingMatch[1].charAt(0).toUpperCase() + ratingMatch[1].slice(1).toLowerCase()) as 'Buy' | 'Hold' | 'Sell' : undefined;
}

function extractConfidence(text: string): 'High' | 'Medium' | 'Low' | undefined {
  const confidenceMatch = text.match(/confidence[:\s]*(high|medium|low)/i);
  return confidenceMatch ? (confidenceMatch[1].charAt(0).toUpperCase() + confidenceMatch[1].slice(1).toLowerCase()) as 'High' | 'Medium' | 'Low' : undefined;
}

function parseTable(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const headers: string[] = [];
  const rows: string[][] = [];

  for (const line of lines) {
    if (line.includes('|') || line.includes('\t')) {
      const cells = line.split(/[|\t]/).map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length > 1) {
        if (headers.length === 0) {
          headers.push(...cells);
        } else if (!line.includes('---') && !line.includes('===')) {
          rows.push(cells);
        }
      }
    }
  }

  return { headers, rows };
}