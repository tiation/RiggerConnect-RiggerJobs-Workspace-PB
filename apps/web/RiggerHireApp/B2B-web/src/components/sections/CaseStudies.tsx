import { Card } from '@/components/ui/Card';
import { ArrowTrendingUpIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

interface CaseStudy {
  company: string;
  challenge: string;
  solution: string;
  roi: string;
}

interface CaseStudiesProps {
  studies: CaseStudy[];
}

export function CaseStudies({ studies }: CaseStudiesProps) {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how leading Western Australian companies transformed their workforce management
          </p>
        </div>

        {/* Featured Case Study */}
        <div className="mb-16">
          <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Major Mining Corporation Success Story
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-400">Challenge</h4>
                    <p className="text-gray-300">
                      Managing compliance for 200+ riggers across multiple sites while 
                      maintaining WorkSafe WA standards and reducing hiring time.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-400">Solution</h4>
                    <p className="text-gray-300">
                      Implemented RiggerHireApp's enterprise platform with automated 
                      compliance checking and real-time worker verification.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-400">Results</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-fuchsia-400" />
                        <span>Reduced hiring time from 6 weeks to 5 days</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-fuchsia-400" />
                        <span>Achieved 100% compliance rate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-fuchsia-400" />
                        <span>85% reduction in administrative costs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-lg" />
                <img
                  src="/images/mining-site.jpg"
                  alt="Mining site"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Case Studies */}
        <div className="grid md:grid-cols-3 gap-8">
          {studies.map((study, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20"
            >
              <div className="mb-4">
                <span className="text-sm text-cyan-400">Case Study</span>
                <h3 className="text-xl font-semibold mt-1">{study.company}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Challenge</h4>
                  <p className="mt-1">{study.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Solution</h4>
                  <p className="mt-1">{study.solution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">ROI</h4>
                  <p className="mt-1 text-fuchsia-400 font-semibold">{study.roi}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border-cyan-500/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Workforce Management?</h3>
            <p className="text-gray-300 mb-6">
              Join these industry leaders in revolutionizing your hiring process
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Book a Demo
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
}
