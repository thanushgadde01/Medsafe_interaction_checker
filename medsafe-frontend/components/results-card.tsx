'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { InteractionPrediction } from '@/types';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface ResultsCardProps {
  prediction: InteractionPrediction | null;
  isLoading?: boolean;
}

export function ResultsCard({ prediction, isLoading = false }: ResultsCardProps) {
  if (!prediction) {
    return null;
  }

  const getSeverityColor = (label: string) => {
    switch (label) {
      case 'Major':
        return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200', icon: 'AlertTriangle' };
      case 'Moderate':
        return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200', icon: 'AlertCircle' };
      case 'Safe':
        return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200', icon: 'CheckCircle' };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800', text: 'text-gray-800 dark:text-gray-200', icon: 'AlertCircle' };
    }
  };

  const severity = getSeverityColor(prediction.severity_label);

  // Data for the probability chart
  const chartData = [
    {
      name: 'Major',
      probability: Math.round(prediction.raw_probabilities.Major * 100),
    },
    {
      name: 'Moderate',
      probability: Math.round(prediction.raw_probabilities.Moderate * 100),
    },
    {
      name: 'Safe',
      probability: Math.round(prediction.raw_probabilities.Safe * 100),
    },
  ];

  const chartColors = {
    Major: '#ef4444',
    Moderate: '#f59e0b',
    Safe: '#10b981',
  };

  return (
    <Card className="mt-6 animate-fade-in-up">
      <CardHeader>
        <h3 className="text-2xl font-bold">Interaction Analysis Results</h3>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Severity Level */}
        <div className={`${severity.bg} ${severity.border} border rounded-lg p-6`}>
          <div className="flex items-center gap-4">
            {prediction.severity_label === 'Major' && <AlertTriangle className={`w-8 h-8 ${severity.text}`} />}
            {prediction.severity_label === 'Moderate' && <AlertCircle className={`w-8 h-8 ${severity.text}`} />}
            {prediction.severity_label === 'Safe' && <CheckCircle className={`w-8 h-8 ${severity.text}`} />}

            <div>
              <p className="text-sm font-medium opacity-75">Predicted Severity Level</p>
              <p className={`text-3xl font-bold ${severity.text}`}>{prediction.severity_label}</p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Model Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {prediction.confidence}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${parseFloat(prediction.confidence)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Probability Breakdown */}
        <div>
          <h4 className="font-semibold mb-4">Probability Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                formatter={(value) => [`${value}%`, 'Probability']}
              />
              <Legend />
              <Bar dataKey="probability" fill="#3b82f6" name="Probability (%)" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={chartColors[entry.name as keyof typeof chartColors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Raw Probabilities Table */}
        <div>
          <h4 className="font-semibold mb-4">Raw Probabilities (SHAP-like breakdown)</h4>
          <div className="space-y-2">
            {Object.entries(prediction.raw_probabilities).map(([label, probability]) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <span className="font-medium">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full`}
                      style={{
                        width: `${probability * 100}%`,
                        backgroundColor: chartColors[label as keyof typeof chartColors],
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-right w-12">{(probability * 100).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚠️ Important:</strong> This analysis is provided for informational purposes only. Always consult with a healthcare professional before making any decisions about your medications or diet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
