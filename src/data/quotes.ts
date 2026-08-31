import { StatusQuote } from '../types/index.js';
import { QUOTES_400 } from './quotes/400.js';
import { QUOTES_401 } from './quotes/401.js';
import { QUOTES_403 } from './quotes/403.js';
import { QUOTES_404 } from './quotes/404.js';
import { QUOTES_405 } from './quotes/405.js';
import { QUOTES_408 } from './quotes/408.js';
import { QUOTES_409 } from './quotes/409.js';
import { QUOTES_422 } from './quotes/422.js';
import { QUOTES_429 } from './quotes/429.js';
import { QUOTES_500 } from './quotes/500.js';
import { QUOTES_502 } from './quotes/502.js';
import { QUOTES_503 } from './quotes/503.js';
import { QUOTES_504 } from './quotes/504.js';
import { QUOTES_MISC } from './quotes/misc.js';

export const STATUS_QUOTES: StatusQuote[] = [
  ...QUOTES_400,
  ...QUOTES_401,
  ...QUOTES_403,
  ...QUOTES_404,
  ...QUOTES_405,
  ...QUOTES_408,
  ...QUOTES_409,
  ...QUOTES_422,
  ...QUOTES_429,
  ...QUOTES_500,
  ...QUOTES_502,
  ...QUOTES_503,
  ...QUOTES_504,
  ...QUOTES_MISC
];

export const MAINTENANCE_DATA = {
  status: 'active' as const,
  estimatedDuration: '15 to 30 minutes',
  estimatedCompletion: 'In approximately 12 minutes',
  wittyHeadline: 'Tuning the engine and polishing the chrome',
  message: 'Our platform is undergoing scheduled maintenance to upgrade database clusters and improve response speeds. No data is lost, and our technicians are already wrapping up.',
  currentActivity: 'Running database migrations and index warmups',
  progressPercent: 78,
  supportEmail: 'status@example.com'
};
