import { STATUS_QUOTES, MAINTENANCE_DATA } from '../data/quotes.js';
import { StatusQuote, ErrorResponsePayload, MaintenanceStatus } from '../types/index.js';

export class StatusService {
  getAllQuotes(): StatusQuote[] {
    return STATUS_QUOTES;
  }

  getQuotesByCode(code: number): StatusQuote[] {
    return STATUS_QUOTES.filter((q) => q.code === code);
  }

  getQuotesByCategory(category: string): StatusQuote[] {
    return STATUS_QUOTES.filter((q) => q.category === category);
  }

  getRandomQuote(code?: number, category?: string): StatusQuote {
    let pool = STATUS_QUOTES;

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

  buildErrorPayload(code: number, customMessage?: string): ErrorResponsePayload {
    const quotes = this.getQuotesByCode(code);
    const id = `req_${Math.random().toString(36).substring(2, 9)}`;

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
