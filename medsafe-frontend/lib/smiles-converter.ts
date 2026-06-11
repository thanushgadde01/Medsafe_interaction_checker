import type { SmilesConversionResult } from '@/types';

// In production, these would be loaded from actual datasets
// For now, we'll create mock implementations that can be replaced with real data

const MOCK_PUBMED_DATA: Record<string, string> = {
  aspirin: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  ibuprofen: 'CC(C)CC1=CC(=C(C=C1)C(C)C(=O)O)O',
  acetaminophen: 'CC(=O)NC1=CC=C(O)C=C1',
  warfarin: 'CC(=O)CC(C1=CC=CC=C1)C2=C(O)C3=CC=CC=C3OC2=O',
  metformin: 'CC(C)NCC(C)NCC(C)N',
  lisinopril: 'NCCCCNC(=O)C(CCCNC(=O)C1CCCN1C(=O)C(CCCCN)NC(=O)C)NC(=O)C(CC(=O)O)NC(=O)C(CCCNC(=O)C)NC(=O)C',
  atorvastatin: 'CC(C)C(C(=O)Nc1c(c(cc(c1Cl)F)Cl)Cl)(c2cccnc2)C(C)(C)O',
};

const MOCK_FOODDB_DATA: Record<string, string> = {
  banana: 'C1=CC(=C(C=C1C2=CC(=O)OC3=C2C(=C(C=C3)O)O)O)O',
  apple: 'C1=CC(=C(C=C1C2=CC(=O)OC3=C2C(=C(C=C3)O)O)O)O',
  orange: 'C1=CC(=C(C=C1C2=CC(=O)OC3=C2C(=C(C=C3)O)O)O)O',
  milk: 'C1=CC(=C(C=C1O)O)C(=O)O',
  grapefruit: 'C1=CC(=C(C=C1C2=CC(=O)OC3=C2C(=C(C=C3)O)O)O)O',
  coffee: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
  green_tea: 'O1C(C(OC(C1O)C(O)C)OC)C',
  spinach: 'C1=CC=C(C=C1)C(C(=O)O)N',
  cheese: 'C1=CC(=C(C=C1O)O)C(=O)O',
};

/**
 * Delay function to avoid rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert drug name to SMILES string
 * In production, this would query PubMed or a similar database
 */
export async function convertDrugToSmiles(drugName: string): Promise<SmilesConversionResult> {
  await delay(500); // Rate limiting protection

  const normalizedName = drugName.toLowerCase().trim();
  const smiles = MOCK_PUBMED_DATA[normalizedName];

  if (!smiles) {
    // Fallback: attempt to search in PubMed API (mock)
    return {
      name: drugName,
      smiles: 'C1=CC=CC=C1', // Generic benzene ring as fallback
      source: 'pubmed',
      confidence: 0.5,
    };
  }

  return {
    name: drugName,
    smiles,
    source: 'pubmed',
    confidence: 0.95,
  };
}

/**
 * Convert food name to SMILES string
 * In production, this would query FooDB
 */
export async function convertFoodToSmiles(foodName: string): Promise<SmilesConversionResult> {
  await delay(500); // Rate limiting protection

  const normalizedName = foodName.toLowerCase().trim();
  const smiles = MOCK_FOODDB_DATA[normalizedName];

  if (!smiles) {
    // Fallback: attempt to search in FooDB (mock)
    return {
      name: foodName,
      smiles: 'C1=CC=CC=C1', // Generic benzene ring as fallback
      source: 'fooddb',
      confidence: 0.5,
    };
  }

  return {
    name: foodName,
    smiles,
    source: 'fooddb',
    confidence: 0.95,
  };
}

/**
 * Fetch clinical text from PubMed API
 * This searches for known interactions and returns relevant clinical information
 */
export async function fetchClinicalText(drugName: string, foodName: string): Promise<string> {
  await delay(500); // Rate limiting protection

  // Mock clinical text generation
  const mockClinicalTexts = [
    `Drug-food interaction potential identified. ${drugName} may interact with ${foodName} affecting bioavailability.`,
    `Clinical studies suggest possible interaction between ${drugName} and dietary components in ${foodName}.`,
    `Moderate interaction potential. Consult healthcare provider before combining ${drugName} with ${foodName}.`,
    `No significant interaction expected between ${drugName} and ${foodName} based on available literature.`,
  ];

  return mockClinicalTexts[Math.floor(Math.random() * mockClinicalTexts.length)];
}

/**
 * Batch convert names to SMILES with rate limiting
 */
export async function batchConvertToSmiles(
  drugName: string,
  foodName: string
): Promise<{
  drug: SmilesConversionResult;
  food: SmilesConversionResult;
  clinicalText: string;
}> {
  const [drug, food, clinicalText] = await Promise.all([
    convertDrugToSmiles(drugName),
    convertFoodToSmiles(foodName),
    fetchClinicalText(drugName, foodName),
  ]);

  return { drug, food, clinicalText };
}
