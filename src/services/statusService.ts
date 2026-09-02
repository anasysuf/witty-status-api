import { randomUUID } from 'node:crypto';
import { STATUS_QUOTES, MAINTENANCE_DATA } from '../data/quotes.js';
import { StatusQuote, ErrorResponsePayload, MaintenanceStatus, RFC7807ProblemDetails } from '../types/index.js';

export class StatusService {
  private readonly quotesByCode = new Map<number, StatusQuote[]>();
  private readonly quotesByCategory = new Map<string, StatusQuote[]>();

  constructor() {
    this.indexQuotes();
  }

  private indexQuotes(): void {
    for (const quote of STATUS_QUOTES) {
      // Index by HTTP status code
      const codeList = this.quotesByCode.get(quote.code);
      if (codeList) {
        codeList.push(quote);
      } else {
        this.quotesByCode.set(quote.code, [quote]);
      }

      // Index by category
      const categoryList = this.quotesByCategory.get(quote.category);
      if (categoryList) {
        categoryList.push(quote);
      } else {
        this.quotesByCategory.set(quote.category, [quote]);
      }
    }
  }

  getAllQuotes(): StatusQuote[] {
    return STATUS_QUOTES;
  }

  getQuotesByCode(code: number): StatusQuote[] {
    return this.quotesByCode.get(code) || [];
  }

  getQuotesByCategory(category: string): StatusQuote[] {
    return this.quotesByCategory.get(category) || [];
  }

  getRandomQuote(code?: number, category?: string): StatusQuote {
    let pool: StatusQuote[] = STATUS_QUOTES;

    if (code) {
      const codeFiltered = this.getQuotesByCode(code);
      if (codeFiltered.length > 0) {
        pool = codeFiltered;
      } else {
        const isClient = code >= 400 && code < 500;
        return {
          id: `${code}-fallback`,
          code: code,
          category: isClient ? 'client_error' : 'server_error',
          title: isClient ? 'Client Error' : 'Server Error',
          headline: isClient ? 'Unusual request pattern detected' : 'Unexpected server condition encountered',
          wittyMessage: isClient
            ? 'Our server received an exotic status request that rarely appears in everyday web traffic.'
            : 'An unusual server state occurred that baffled our standard handlers. Investigation is underway.',
          technicalDetails: `HTTP ${code} condition encountered with no pre-configured quote mapping.`,
          actionAdvice: 'Verify endpoint parameters or check system logs for additional context.',
          suggestedAction: 'retry'
        };
      }
    } else if (category) {
      const catFiltered = this.getQuotesByCategory(category);
      if (catFiltered.length > 0) {
        pool = catFiltered;
      }
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  buildErrorPayload(code: number, customMessage?: string, customRequestId?: string): ErrorResponsePayload {
    const quotes = this.getQuotesByCode(code);
    const id = customRequestId || `req_${randomUUID().replace(/-/g, '').slice(0, 12)}`;

    if (quotes.length > 0) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return {
        success: false,
        status: quote.code,
        title: quote.title,
        headline: quote.headline,
        wittyMessage: customMessage || quote.wittyMessage,
        technicalDetails: quote.technicalDetails,
        actionAdvice: quote.actionAdvice,
        suggestedAction: quote.suggestedAction,
        timestamp: new Date().toISOString(),
        requestId: id
      };
    }

    // Graceful fallback for unmapped custom HTTP error codes
    const isClient = code >= 400 && code < 500;
    return {
      success: false,
      status: code,
      title: isClient ? 'Client Error' : 'Server Error',
      headline: isClient ? 'Unusual request pattern detected' : 'Unexpected server condition encountered',
      wittyMessage:
        customMessage ||
        (isClient
          ? 'Our server received an exotic status request that rarely appears in everyday web traffic.'
          : 'An unusual server state occurred that baffled our standard handlers. Investigation is underway.'),
      technicalDetails: `HTTP ${code} condition encountered with no pre-configured quote mapping.`,
      actionAdvice: 'Verify endpoint parameters or check system logs for additional context.',
      suggestedAction: 'retry',
      timestamp: new Date().toISOString(),
      requestId: id
    };
  }

  buildRfc7807Payload(
    code: number,
    customMessage?: string,
    customRequestId?: string,
    instanceUri?: string
  ): RFC7807ProblemDetails {
    const std = this.buildErrorPayload(code, customMessage, customRequestId);
    return {
      type: `https://httpstatuses.io/${code}`,
      title: std.title,
      status: std.status,
      detail: std.wittyMessage,
      instance: instanceUri,
      headline: std.headline,
      actionAdvice: std.actionAdvice,
      suggestedAction: std.suggestedAction,
      technicalDetails: std.technicalDetails,
      requestId: std.requestId,
      timestamp: std.timestamp
    };
  }

  getMaintenanceData(): MaintenanceStatus {
    return {
      ...MAINTENANCE_DATA,
      estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }
}

export const statusService = new StatusService();

