/**
 * Company Registry and Pre-configured Research Cases
 */

export interface CompanyMeta {
  ticker: string;
  name: string;
  exchange: string;
  cik: string;
  sector: string;
  industry: string;
  description: string;
  isDemoCase: boolean;
  secEdgarUrl: string;
}

export const SUPPORTED_COMPANIES: CompanyMeta[] = [
  {
    ticker: 'SNOW',
    name: 'Snowflake Inc.',
    exchange: 'NYSE',
    cik: '0001640147',
    sector: 'Technology',
    industry: 'Cloud Software & Data Platforms',
    description: 'Enterprise data cloud platform for data warehousing, data lake, and AI workloads.',
    isDemoCase: true,
    secEdgarUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001640147',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    cik: '0001045810',
    sector: 'Technology',
    industry: 'Semiconductors & AI Compute',
    description: 'Pioneer of accelerated computing, GPUs, and full-stack AI data center infrastructure.',
    isDemoCase: false,
    secEdgarUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001045810',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    cik: '0001318605',
    sector: 'Consumer Discretionary',
    industry: 'Automotive & Clean Energy',
    description: 'Electric vehicles, energy storage systems, and autonomous software platform.',
    isDemoCase: false,
    secEdgarUrl: 'https://www.sec.gov/edgar/browse/?CIK=0001318605',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    cik: '0000789019',
    sector: 'Technology',
    industry: 'Systems Software & Cloud Infrastructure',
    description: 'Global cloud, productivity software, gaming, and commercial AI foundation.',
    isDemoCase: false,
    secEdgarUrl: 'https://www.sec.gov/edgar/browse/?CIK=0000789019',
  },
];
