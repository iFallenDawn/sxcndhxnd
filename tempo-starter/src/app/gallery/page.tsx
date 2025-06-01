import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Gallery() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      alt: "Minimalist white shirt",
      category: "Essentials",
    },
    {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      alt: "Black statement piece",
      category: "Statement",
    },
    {
      src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      alt: "Neutral tones collection",
      category: "Essentials",
    },
    {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      alt: "Structured blazer",
      category: "Statement",
    },
    {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      alt: "Casual wear",
      category: "Essentials",
    },
    {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      alt: "Evening wear",
      category: "Statement",
    },
    {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      alt: "Minimalist dress",
      category: "Essentials",
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      alt: "Layered look",
      category: "Statement",
    },
    {
      src: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80",
      alt: "Textured fabric",
      category: "Essentials",
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
              Gallery
            </h1>
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-2xl mx-auto">
              A curated collection showcasing our latest designs and the
              aesthetic philosophy behind sxcndhxnd.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-light tracking-wide uppercase">
                    {image.category}
                  </p>
                  <h3 className="text-lg font-light tracking-wide capitalize mt-1">
                    {image.alt}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-6 tracking-wide uppercase">
              Latest Drop
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto font-light">
              Discover our newest pieces that embody the essence of modern
              minimalism.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                alt="Featured piece 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                alt="Featured piece 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
