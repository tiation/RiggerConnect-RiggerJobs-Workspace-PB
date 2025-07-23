import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-construction.jpg"
          alt="Construction site"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {subtitle}
          </p>
          <div className="flex gap-4">
            <Button size="lg" variant="primary" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/badges/worksafe-wa.svg"
                alt="WorkSafe WA Certified"
                width={40}
                height={40}
              />
              <span className="text-sm">WorkSafe WA Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/badges/iso-27001.svg"
                alt="ISO 27001 Certified"
                width={40}
                height={40}
              />
              <span className="text-sm">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/badges/wcag.svg"
                alt="WCAG 2.1 Compliant"
                width={40}
                height={40}
              />
              <span className="text-sm">WCAG 2.1 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
