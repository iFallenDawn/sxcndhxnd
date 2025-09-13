import Footer from "@/components/layout/footer/footer";
import Navbar from "@/components/layout/navbar/navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-light mb-8 tracking-wide uppercase">
              About sxcndhxnd
            </h1>
            <p className="text-xl text-gray-700 font-light leading-relaxed mb-12">
              Born from a passion for minimalist design and sustainable fashion,
              sxcndhxnd represents the intersection of contemporary style and
              conscious consumption.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div>
              <h2 className="text-4xl font-light mb-8 tracking-wide uppercase">
                Our Story
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-6">
                Founded in 2020, sxcndhxnd emerged from a desire to create
                clothing that transcends trends. We believe in the power of
                simplicity and the beauty found in clean lines and thoughtful
                construction.
              </p>
              <p className="text-gray-700 font-light leading-relaxed mb-6">
                Each piece is carefully designed to be versatile, durable, and
                timeless. We work with sustainable materials and ethical
                manufacturing processes to ensure our impact on the world aligns
                with our values.
              </p>
              <p className="text-gray-700 font-light leading-relaxed">
                Our name, sxcndhxnd, represents the idea of giving fashion a
                second chance – creating pieces that last, that can be worn
                season after season, year after year.
              </p>
            </div>
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Our atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-6 tracking-wide uppercase">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 tracking-wide uppercase">
                Sustainability
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We prioritize eco-friendly materials and ethical production
                methods to minimize our environmental footprint.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 tracking-wide uppercase">
                Quality
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Every garment is crafted with attention to detail and built to
                last, ensuring longevity over fast fashion.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 tracking-wide uppercase">
                Minimalism
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Clean lines, thoughtful design, and versatile pieces that form
                the foundation of a conscious wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
