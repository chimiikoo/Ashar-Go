import HeroSection from '@/components/home/HeroSection';
import PopularProjects from '@/components/home/PopularProjects';
import NewProjects from '@/components/home/NewProjects';
import Categories from '@/components/home/Categories';
import HowItWorks from '@/components/home/HowItWorks';
import Stats from '@/components/home/Stats';
import CTABanner from '@/components/home/CTABanner';
import OrnamentSeparator from '@/components/ui/OrnamentSeparator';

export default function HomePage() {
  return (
    <div style={{ background: '#0a0a0a' }}>
      <HeroSection />
      <PopularProjects />
      <OrnamentSeparator />
      <Categories />
      <OrnamentSeparator />
      <CTABanner />
      <OrnamentSeparator />
      <NewProjects />
      <OrnamentSeparator />
      <HowItWorks />
      <Stats />
    </div>
  );
}
