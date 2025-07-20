import React, { useState } from 'react';

interface CalculatorInputs {
  workersNeeded: number;
  hiringFrequency: number;
  currentHiringCost: number;
}

export default function PricingCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    workersNeeded: 10,
    hiringFrequency: 12,
    currentHiringCost: 1000,
  });

  const calculateSavings = () => {
    const currentAnnualCost = inputs.workersNeeded * inputs.hiringFrequency * inputs.currentHiringCost;
    const riggerHireAppCost = {
      platform: 599 * 12, // Professional plan annual cost
      perHire: inputs.workersNeeded * inputs.hiringFrequency * 250, // Estimated cost per hire
    };
    const totalNewCost = riggerHireAppCost.platform + riggerHireAppCost.perHire;
    const annualSavings = currentAnnualCost - totalNewCost;
    const savingsPercentage = (annualSavings / currentAnnualCost) * 100;

    return {
      currentAnnualCost,
      newAnnualCost: totalNewCost,
      annualSavings,
      savingsPercentage,
    };
  };

  const savings = calculateSavings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-cyan-400 mb-6">
            Calculate Your Savings
          </h3>
          
          <div>
            <label className="block text-gray-300 mb-2">
              Number of Workers Needed Annually
            </label>
            <input
              type="number"
              name="workersNeeded"
              value={inputs.workersNeeded}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Hiring Frequency (times per year)
            </label>
            <input
              type="number"
              name="hiringFrequency"
              value={inputs.hiringFrequency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Current Cost per Hire ($)
            </label>
            <input
              type="number"
              name="currentHiringCost"
              value={inputs.currentHiringCost}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none"
              min="0"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-900 rounded-lg p-6 space-y-6">
          <h3 className="text-2xl font-semibold text-cyan-400 mb-6">
            Projected Annual Savings
          </h3>

          <div>
            <p className="text-gray-300 mb-2">Current Annual Hiring Costs</p>
            <p className="text-3xl font-bold text-white">
              ${savings.currentAnnualCost.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-300 mb-2">New Annual Costs with RiggerHireApp</p>
            <p className="text-3xl font-bold text-cyan-400">
              ${savings.newAnnualCost.toLocaleString()}
            </p>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-gray-300 mb-2">Total Annual Savings</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              ${savings.annualSavings.toLocaleString()}
            </p>
            <p className="text-lg text-gray-300 mt-2">
              {savings.savingsPercentage.toFixed(1)}% cost reduction
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-400">
          * Calculations are estimates based on industry averages and may vary depending on your specific circumstances.
          Contact our sales team for a detailed analysis of your potential savings.
        </p>
      </div>
    </div>
  );
}
