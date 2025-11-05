import CollectionsSection from '@/components/home/collections-section';
import CommissionCTA from '@/components/home/commission-cta';
import Hero from '@/components/home/hero';
import Navbar from '@/components/layout/navbar/navbar';
import { createClient } from '../../supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='bg-white'>
      <Navbar />
      <Hero />

      <CollectionsSection />
      <CommissionCTA />
    </div>
  );
}
