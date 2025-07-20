import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface ROIMetrics {
  timeSaved: number;
  costSaved: number;
  complianceImprovement: number;
  annualSavings: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState({
    hiresPerMonth: 5,
    averageHourlyRate: 150,
    currentHiringHours: 40,
    currentComplianceRate: 95,
  });

  const [metrics, setMetrics] = useState<ROIMetrics>({
    timeSaved: 0,
    costSaved: 0,
    complianceImprovement: 0,
    annualSavings: 0,
  });

  // Calculate ROI metrics when inputs change
  useEffect(() => {
    const calculateROI = () => {
      // Time saved calculations
      const newHiringHours = inputs.currentHiringHours * 0.25; // 75% reduction
      const hoursSavedPerMonth = inputs.currentHiringHours - newHiringHours;
      
      // Cost savings calculations
      const monthlyCostSaved = hoursSavedPerMonth * inputs.averageHourlyRate;
      const annualSavings = monthlyCostSaved * 12;
      
      // Compliance improvement
      const newComplianceRate = 100;
      const complianceImprovement = newComplianceRate - inputs.currentComplianceRate;

      setMetrics({
        timeSaved: hoursSavedPerMonth,
        costSaved: monthlyCostSaved,
        complianceImprovement: complianceImprovement,
        annualSavings: annualSavings,
      });
    };

    calculateROI();
  }, [inputs]);

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          Calculate Your ROI
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Your Current Process</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Hires
              </label>
              <Input
                type="number"
                value={inputs.hiresPerMonth}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  hiresPerMonth: parseInt(e.target.value) || 0
                }))}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Average Hourly Rate (AUD)
              </label>
              <Input
                type="number"
                value={inputs.averageHourlyRate}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  averageHourlyRate: parseInt(e.target.value) || 0
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Hours Spent on Hiring (Monthly)
              </label>
              <Input
                type="number"
                value={inputs.currentHiringHours}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  currentHiringHours: parseInt(e.target.value) || 0
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Compliance Rate (%)
              </label>
              <Input
                type="number"
                value={inputs.currentComplianceRate}
                onChange={(e) => setInputs(prev => ({
                  ...prev,
                  currentComplianceRate: parseInt(e.target.value) || 0
                }))}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Your Potential Savings</h3>
            
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
                <h4 className="text-lg font-medium mb-2">Time Saved Monthly</h4>
                <p className="text-3xl font-bold text-cyan-400">
                  {metrics.timeSaved.toFixed(1)} hours
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
                <h4 className="text-lg font-medium mb-2">Monthly Cost Savings</h4>
                <p className="text-3xl font-bold text-fuchsia-400">
                  ${metrics.costSaved.toLocaleString()}
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
                <h4 className="text-lg font-medium mb-2">Compliance Improvement</h4>
                <p className="text-3xl font-bold text-cyan-400">
                  +{metrics.complianceImprovement}%
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
                <h4 className="text-lg font-medium mb-2">Annual Savings</h4>
                <p className="text-3xl font-bold text-fuchsia-400">
                  ${metrics.annualSavings.toLocaleString()}
                </p>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" variant="primary" asChild>
                <a href="/contact">Book a Demo</a>
              </Button>
              <p className="mt-4 text-sm text-gray-400">
                Get a detailed ROI analysis for your business
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
