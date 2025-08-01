import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import CollectionsSection from "@/components/collections-section";
import PhilosophySection from "@/components/philosophy-section";
import CommissionCTA from "@/components/commission-cta";
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
