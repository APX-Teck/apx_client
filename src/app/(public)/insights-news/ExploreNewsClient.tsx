'use client';

import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { useInsightsHeroLogic } from './hooks/useInsightsHeroLogic';
import { InsightsHero } from './components/InsightsHero';

export function ExploreNewsClient() {
  const { typewrittenText, currentFullWord, phraseIndex, heroPhrases } = useInsightsHeroLogic();

  return (
    <>
      <MouseSpotlight />
      <FloatingWhatsApp phoneNumber="919405282582" />

      {/* Animated Hero Section */}
      <InsightsHero
        typewrittenText={typewrittenText}
        currentFullWord={currentFullWord}
        phraseIndex={phraseIndex}
        heroPhrases={heroPhrases}
      />
    </>
  );
}
