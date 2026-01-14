export enum LeadState {
  SPAM = "SPAM",
  COLD = "COLD",
  CURIOSO = "CURIOSO",
  WARM = "WARM",
  HOT = "HOT",
}

export enum SignalCategory {
  DOR = "DOR",
  URGENCIA = "URGENCIA",
  ECONOMICO = "ECONOMICO",
  MEDO = "MEDO",
  ENGAJAMENTO = "ENGAJAMENTO",
  DECISAO_SILENCIOSA = "DECISAO_SILENCIOSA",
  MENTIRA_EDUCADA = "MENTIRA_EDUCADA",
  SPAM = "SPAM",
}

export interface LeadContext {
  text: string;
  responseTime?: number;
  messageLength?: number;
  audio?: boolean;
  previousState?: LeadState;
}

export interface LeadScores {
  timing: number;
  affective: number;
  economic: number;
  risk: number;
  engagement: number;
  total: number;
}

export interface TAEREWeights {
  timing: number;
  affective: number;
  economic: number;
  risk: number;
  engagement: number;
}

export interface LeadSignal {
  category: SignalCategory;
  matched: string;
  weight: number;
}

export interface EvaluationResult {
  state: LeadState;
  scores: LeadScores;
  signals: LeadSignal[];
  reasons: string[];
  nextAction: "ROUTE_TO_HUMAN" | "ASK_QUALIFYING" | "NURTURE" | "REACTIVATE" | "BLOCK";
  confidence: number;
}
