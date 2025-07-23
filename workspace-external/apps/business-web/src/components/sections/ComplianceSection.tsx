import { Card } from '@/components/ui/Card';
import { CheckCircleIcon, ShieldCheckIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';

interface ComplianceSectionProps {
  standards: string[];
}

export function ComplianceSection({ standards }: ComplianceSectionProps) {
  const complianceFeatures = [
    {
      title: "Automated Compliance Checks",
      description: "Real-time verification of licenses, certifications, and qualifications against WorkSafe WA standards",
      icon: CheckCircleIcon,
    },
    {
      title: "Digital Documentation",
      description: "Secure storage and automated validation of all required safety documentation and certifications",
      icon: DocumentCheckIcon,
    },
    {
      title: "Risk Management",
      description: "Proactive monitoring and alerts for expiring certifications and compliance requirements",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Enterprise-Grade Compliance
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ensure 100% compliance with Western Australian safety standards and regulations
          </p>
        </div>

        {/* Compliance Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {complianceFeatures.map((feature, index) => (
            <Card key={index} className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
              <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Standards Compliance */}
        <div className="bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Compliance Standards
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {standards.map((standard, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10"
              >
                <CheckCircleIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <span className="text-gray-200">{standard}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <div className="text-gray-400">Compliance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-fuchsia-400 mb-2">24/7</div>
            <div className="text-gray-400">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;1hr</div>
            <div className="text-gray-400">Verification Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-fuchsia-400 mb-2">5000+</div>
            <div className="text-gray-400">Verified Workers</div>
          </div>
        </div>

        {/* Trust Signal */}
        <div className="mt-16 text-center">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20">
            <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h4 className="text-xl font-semibold mt-4 mb-2">
            WorkSafe WA Certified Platform
          </h4>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform is fully certified and compliant with all Western Australian safety and labor regulations
          </p>
        </div>
      </div>
    </section>
  );
}
