import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Content */}
      <div className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-6xl sm:text-7xl font-light text-black mb-6 tracking-wide uppercase">
              sxcndhxnd
            </h1>

            <p className="text-lg text-gray-600 mb-12 font-light tracking-wide">
              Minimalist streetwear for the modern individual
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/store"
                className="inline-flex items-center px-8 py-3 text-white bg-black hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Shop Now
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>

              <Link
                href="/gallery"
                className="inline-flex items-center px-8 py-3 text-black border border-black hover:bg-black hover:text-white transition-colors text-sm font-medium tracking-wide uppercase"
              >
                View Gallery
              </Link>
            </div>
          </div>

          {/* Latest Drop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Latest Drop - Minimalist Hoodie"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
                alt="Latest Drop - Essential Tee"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer md:col-span-2 lg:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
                alt="Latest Drop - Oversized Jacket"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
