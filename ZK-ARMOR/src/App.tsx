import { useState } from 'react';
import { ZKArmorHeader } from './components/ZKArmorHeader';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CTASection } from './components/CTASection';
import { ZKArmorFooter } from './components/ZKArmorFooter';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { DemoWorkflow } from './components/DemoWorkflow';

type Page = 'home' | 'docs' | 'demo';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (currentPage === 'docs') {
    return <ArchitectureDocs onBackToHome={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'demo') {
    return (
      <>
        <ZKArmorHeader 
          onNavigateToDocs={() => setCurrentPage('docs')}
          onNavigateToDemo={() => setCurrentPage('demo')}
        />
        <DemoWorkflow />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <ZKArmorHeader 
        onNavigateToDocs={() => setCurrentPage('docs')}
        onNavigateToDemo={() => setCurrentPage('demo')}
      />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <CTASection />
      <ZKArmorFooter />
    </div>
  );
}
