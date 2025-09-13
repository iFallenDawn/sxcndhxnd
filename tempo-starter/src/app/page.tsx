import Footer from "@/components/layout/footer/footer";
import Hero from "@/components/home/hero";
import Navbar from "@/components/layout/navbar/navbar";
import CollectionsSection from "@/components/home/collections-section";
import PhilosophySection from "@/components/home/philosophy-section";
import CommissionCTA from "@/components/home/commission-cta";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <CollectionsSection />

      <PhilosophySection />

      <CommissionCTA />

      <Footer />
    </div>
  );
}
