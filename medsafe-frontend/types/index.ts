// Backend response types
export interface InteractionPrediction {
  severity_score: number;
  severity_label: 'Major' | 'Moderate' | 'Safe';
  confidence: string;
  raw_probabilities: {
    Major: number;
    Moderate: number;
    Safe: number;
  };
}

export interface BackendResponse {
  status: 'success' | 'error';
  source: 'ml' | 'cache';
  prediction?: InteractionPrediction;
  error?: string;
}

// Frontend types
export interface CheckHistory {
  id: string;
  userId: string;
  drugName: string;
  foodName: string;
  drugSmiles: string;
  foodSmiles: string;
  clinicalText: string;
  result: InteractionPrediction;
  createdAt: Date;
  updatedAt: Date;
}

export interface SmilesConversionResult {
  name: string;
  smiles: string;
  source: 'pubmed' | 'fooddb';
  confidence: number;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  autoSaveHistory: boolean;
}
