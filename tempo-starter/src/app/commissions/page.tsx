import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Commissions() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-light mb-8 tracking-wide uppercase">
              Custom Commissions
            </h1>
            <p className="text-xl text-gray-700 font-light leading-relaxed mb-12">
              Work directly with our designers to create unique pieces tailored
              to your vision. Each commission is a collaborative journey
              resulting in a one-of-a-kind garment.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-6 tracking-wide uppercase">
              Our Process
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-light">
                1
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide uppercase">
                Consultation
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We discuss your vision, preferences, and requirements in detail.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-light">
                2
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide uppercase">
                Design
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Our team creates initial sketches and material selections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-light">
                3
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide uppercase">
                Creation
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Skilled artisans bring your custom piece to life with precision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-light">
                4
              </div>
              <h3 className="text-xl font-light mb-4 tracking-wide uppercase">
                Delivery
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Your unique garment is carefully packaged and delivered to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Form */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-6 tracking-wide uppercase">
                Start Your Commission
              </h2>
              <p className="text-gray-600 font-light">
                Fill out the form below to begin your custom commission journey.
              </p>
            </div>

            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-light tracking-wide uppercase"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="border-gray-300 focus:border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-light tracking-wide uppercase"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    className="border-gray-300 focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-light tracking-wide uppercase"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="border-gray-300 focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="garmentType"
                  className="text-sm font-light tracking-wide uppercase"
                >
                  Garment Type
                </Label>
                <Input
                  id="garmentType"
                  placeholder="e.g., Dress, Shirt, Jacket"
                  className="border-gray-300 focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="budget"
                  className="text-sm font-light tracking-wide uppercase"
                >
                  Budget Range
                </Label>
                <Input
                  id="budget"
                  placeholder="e.g., $500-$1000"
                  className="border-gray-300 focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-light tracking-wide uppercase"
                >
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vision, preferred materials, colors, and any specific requirements..."
                  rows={6}
                  className="border-gray-300 focus:border-black resize-none"
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-medium tracking-wide uppercase"
                >
                  Submit Commission Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
