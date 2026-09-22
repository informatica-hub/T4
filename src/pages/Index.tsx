import { DNAHeroSection } from "@/components/home/DNAHeroSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { VideoSection } from "@/components/home/VideoSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Seo } from "@/components/seo/Seo";

const Index = () => {
  return (
    <>
      <DNAHeroSection />
      <Seo title="T4 México | Síntesis de oligonucleótidos y sondas qPCR" description="Empresa mexicana líder en síntesis de oligos, sondas qPCR, primers y RNA. ISO 9001:2015, entrega rápida en todo México." keywords="síntesis de oligonucleótidos México, primers México, sondas qPCR México, T4 México, biología molecular" />
      <BenefitsSection />
      <VideoSection />
      <ProductsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default Index;
