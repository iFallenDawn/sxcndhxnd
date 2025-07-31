import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Featured Collections */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-6xl font-light tracking-tightest uppercase mb-6">
              Collections
            </h2>
            <p className="text-base font-light leading-relaxed tracking-wide text-gray-600 max-w-xl mx-auto">
              Curated pieces that define modern minimalism
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                  alt="Essentials Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium tracking-normal uppercase mb-2">
                Essentials
              </h3>
              <p className="text-sm font-light leading-relaxed tracking-wide text-gray-600 mb-4">
                Timeless basics for everyday wear
              </p>
              <Link
                href="/store?collection=essentials"
                className="text-xs font-medium tracking-widest uppercase border-b border-black hover:border-gray-400 transition-colors"
              >
                Shop Collection
              </Link>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                  alt="Statement Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium tracking-normal uppercase mb-2">
                Statement
              </h3>
              <p className="text-sm font-light leading-relaxed tracking-wide text-gray-600 mb-4">
                Bold pieces that make an impact
              </p>
              <Link
                href="/store?collection=statement"
                className="text-xs font-medium tracking-widest uppercase border-b border-black hover:border-gray-400 transition-colors"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-5xl md:text-6xl font-light tracking-tightest uppercase mb-8">
              Philosophy
            </h2>
            <p className="text-lg font-light leading-relaxed tracking-wide text-gray-700 mb-12">
              We believe in the power of simplicity. Each piece is carefully
              crafted to embody minimalist design principles while maintaining
              the highest quality standards.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-xs font-medium tracking-widest uppercase border-b border-black hover:border-gray-400 transition-colors"
            >
              Learn More
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Commissions CTA */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl font-light tracking-tightest uppercase mb-6">
            Custom Commissions
          </h2>
          <p className="text-base font-light leading-relaxed tracking-wide text-gray-300 mb-12 max-w-2xl mx-auto">
            Work directly with our designers to create unique pieces tailored to
            your vision.
          </p>
          <Link
            href="/commissions"
            className="inline-flex items-center px-8 py-3 text-black bg-white hover:bg-gray-100 transition-colors text-sm font-medium tracking-wider uppercase"
          >
            Start Commission
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
