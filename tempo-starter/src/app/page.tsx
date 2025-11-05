import CollectionsSection from '@/components/home/collections-section';
import CommissionCTA from '@/components/home/commission-cta';
import Hero from '@/components/home/hero';
import Footer from '@/components/layout/footer/footer';
import Navbar from '@/components/layout/navbar/navbar';
import { createClient } from '../../supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <Hero />

      <CollectionsSection />
      <CommissionCTA />

      <Footer />
    </div>
  );
}
