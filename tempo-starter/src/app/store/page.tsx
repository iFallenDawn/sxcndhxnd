import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Store() {
  const products = [
    {
      id: 1,
      name: "Essential White Tee",
      price: "$85",
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
    {
      id: 2,
      name: "Structured Blazer",
      price: "$320",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 3,
      name: "Minimalist Dress",
      price: "$195",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
    {
      id: 4,
      name: "Oversized Shirt",
      price: "$145",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 5,
      name: "Cropped Jacket",
      price: "$275",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      category: "Statement",
      collection: "statement",
    },
    {
      id: 6,
      name: "Relaxed Trousers",
      price: "$165",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      category: "Essentials",
      collection: "essentials",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-light mb-8 tracking-wide uppercase">
              Store
            </h1>
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-2xl mx-auto">
              Discover our carefully curated collection of minimalist pieces
              designed for the modern wardrobe.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 mb-16">
            <button className="text-sm font-light tracking-wide uppercase border-b-2 border-black pb-2">
              All
            </button>
            <button className="text-sm font-light tracking-wide uppercase text-gray-500 hover:text-black transition-colors pb-2">
              Essentials
            </button>
            <button className="text-sm font-light tracking-wide uppercase text-gray-500 hover:text-black transition-colors pb-2">
              Statement
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-light tracking-wide uppercase mb-2">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-light tracking-wide mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-light mb-4">{product.price}</p>
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-light tracking-wide uppercase"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections CTA */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 tracking-wide uppercase">
              Shop by Collection
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto font-light">
              Explore our thoughtfully designed collections
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <Link href="/store?collection=essentials" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                  alt="Essentials Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-light mb-2 tracking-wide uppercase text-center">
                Essentials
              </h3>
              <p className="text-gray-600 font-light text-center">
                Timeless basics for everyday wear
              </p>
            </Link>

            <Link href="/store?collection=statement" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                  alt="Statement Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-light mb-2 tracking-wide uppercase text-center">
                Statement
              </h3>
              <p className="text-gray-600 font-light text-center">
                Bold pieces that make an impact
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
