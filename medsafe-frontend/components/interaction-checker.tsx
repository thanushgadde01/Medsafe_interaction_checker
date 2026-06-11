'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useMedSafeStore } from '@/lib/store';
import { batchConvertToSmiles } from '@/lib/smiles-converter';
import { backendAPI } from '@/lib/api-client';
import { Loader2, AlertCircle } from 'lucide-react';
import type { InteractionPrediction } from '@/types';

export function InteractionChecker() {
  const [drugName, setDrugName] = useState('');
  const [foodName, setFoodName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setLatestResult } = useMedSafeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!drugName.trim()) {
      setError('Please enter a drug name');
      toast.error('Please enter a drug name');
      return;
    }

    if (!foodName.trim()) {
      setError('Please enter a food name');
      toast.error('Please enter a food name');
      return;
    }

    try {
      setIsLoading(true);

      // Step A: Convert to SMILES
      toast.loading('Converting to molecular structures...');

      const { drug, food, clinicalText } = await batchConvertToSmiles(drugName, foodName);

      if (drug.confidence < 0.5) {
        toast.warning(`Low confidence in drug identification: ${drugName}`);
      }

      if (food.confidence < 0.5) {
        toast.warning(`Low confidence in food identification: ${foodName}`);
      }

      // Step B: Get backend prediction
      toast.loading('Analyzing interaction risk...');

      const response = await backendAPI.predictInteraction(drug.smiles, food.smiles, clinicalText);

      if (response.status === 'success' && response.prediction) {
        setLatestResult(response.prediction);
        toast.success('Prediction complete!');
      } else {
        throw new Error(response.error || 'Unknown error from backend');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process interaction check';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Interaction check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Drug-Food Interaction Checker</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Enter a drug and food to check for potential interactions
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Drug Name"
              placeholder="e.g., Aspirin, Ibuprofen, Warfarin"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              disabled={isLoading}
              helperText="Enter the name of the medication"
            />

            <Input
              label="Food Name"
              placeholder="e.g., Banana, Grapefruit, Coffee"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              disabled={isLoading}
              helperText="Enter the food item to check"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking Interactions...
              </>
            ) : (
              'Check Interaction'
            )}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ⚠️ This tool provides general information only and is not a substitute for professional medical advice.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
