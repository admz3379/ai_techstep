// Type definitions for AI Income Builder v1.0

export type TrackType = 'digital_product' | 'service' | 'ecommerce' | 'consulting';

export type Language = 'en' | 'es' | 'ru' | 'de' | 'fr' | 'fa' | 'ps';

export interface User {
  id: number;
  email: string;
  name?: string;
  language: Language;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  text: Record<Language, string>;
  options: Array<{
    text: Record<Language, string>;
    value: number;
    tracks: TrackType[];
  }>;
  category: string;
}

export interface QuizResponse {
  id: number;
  user_id: number;
  session_id: string;
  question_id: number;
  answer_text?: string;
  answer_value: number;
  created_at: string;
}

export interface UserTrack {
  id: number;
  user_id: number;
  track_type: TrackType;
  score: number;
  assigned_at: string;
}

export interface Payment {
  id: number;
  user_id: number;
  stripe_payment_id?: string;
  stripe_session_id?: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  discount_code?: string;
  discount_amount: number;
  created_at: string;
  completed_at?: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  day: number;
  phase: 'onboarding' | 'weekly';
  status: 'locked' | 'unlocked' | 'completed';
  unlocked_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface UserAsset {
  id: number;
  user_id: number;
  asset_type: 'prompt_bank' | 'template' | 'checklist' | 'resource_list';
  asset_name: string;
  asset_url?: string;
  track_type: TrackType;
  delivered_at: string;
  downloaded_at?: string;
}

export interface AdminAsset {
  id: number;
  name: string;
  description?: string;
  asset_type: 'prompt_bank' | 'template' | 'checklist' | 'resource_list';
  track_type: TrackType;
  file_url: string;
  file_type: 'pdf' | 'doc' | 'gif' | 'image' | 'link';
  created_at: string;
  updated_at: string;
}

export interface ZoomSession {
  id: number;
  session_date: string;
  zoom_link?: string;
  recording_url?: string;
  week_number?: number;
  created_at: string;
}

export interface RefundRequest {
  id: number;
  user_id: number;
  payment_id: number;
  reason?: string;
  evidence_url?: string;
  status: 'pending' | 'approved' | 'denied' | 'processed';
  admin_notes?: string;
  requested_at: string;
  processed_at?: string;
}

export interface Referral {
  id: number;
  referrer_user_id: number;
  referred_user_id?: number;
  referral_code: string;
  referred_email?: string;
  status: 'pending' | 'completed' | 'paid';
  commission_amount: number;
  created_at: string;
  completed_at?: string;
}

// Cloudflare bindings
export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
}

// Quiz flow types
export interface QuizSession {
  session_id: string;
  current_question: number;
  responses: QuizResponse[];
  user_email?: string;
  language: Language;
}

// Track scoring system
export interface TrackScores {
  digital_product: number;
  service: number;
  ecommerce: number;
  consulting: number;
}

// Onboarding flow
export interface OnboardingDay {
  day: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  tasks: Array<{
    title: Record<Language, string>;
    description: Record<Language, string>;
    url?: string;
    completed: boolean;
  }>;
}

// Stripe types
export interface StripeCheckoutSession {
  id: string;
  payment_status: string;
  customer_email?: string;
  amount_total?: number;
  currency?: string;
  payment_intent?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QuizResult {
  track_type: TrackType;
  score: number;
  scores: TrackScores;
  description: Record<Language, string>;
  next_steps: Record<Language, string[]>;
}

// Language translations
export interface Translations {
  [key: string]: Record<Language, string>;
}