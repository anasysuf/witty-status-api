export type HttpStatusCategory = 'client_error' | 'server_error' | 'maintenance';

export interface StatusQuote {
  id: string;
  code: number;
  category: HttpStatusCategory;
  title: string;
  headline: string;
  wittyMessage: string;
  technicalDetails: string;
  actionAdvice: string;
  suggestedAction: 'retry' | 'back' | 'contact_support' | 'wait' | 'login';
}

export interface MaintenanceStatus {
  status: 'active' | 'scheduled' | 'completing';
  estimatedDuration: string;
  estimatedCompletion: string;
  wittyHeadline: string;
  message: string;
  currentActivity: string;
  progressPercent: number;
  supportEmail: string;
}

export interface ErrorResponsePayload {
  success: false;
  status: number;
  title: string;
  headline: string;
  wittyMessage: string;
  technicalDetails: string;
  actionAdvice: string;
  suggestedAction: string;
  timestamp: string;
  requestId: string;
}
