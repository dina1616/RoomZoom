import dynamic from 'next/dynamic';

// Dynamically import components to ensure proper client/server boundary
const HeroSection = dynamic(() => import('@/components/HeroSection'));
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const FeaturedProperties = dynamic(() => import('@/components/FeaturedProperties'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));

export default function Home() {
  return (
    <div className="min-h-screen text-gray-800">
      {/* =========================
          Hero Section with Title
      ========================== */}
      <section aria-labelledby="hero-heading" className="relative">
        <div className="absolute top-0 left-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              RoomZoom
              <span className="block text-lg md:text-xl font-normal mt-2">
                Student Housing Made Simple
              </span>
            </h1>
          </div>
        </div>
        <HeroSection />
      </section>

      {/* =========================
          London Map Section
      ========================== */}
      <section className="py-20 bg-gray-50" aria-labelledby="map-heading">
        <div className="container mx-auto px-4">
          <h2
            id="map-heading"
            className="text-3xl font-bold text-center mb-4"
          >
            Explore London Student Areas
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Discover properties in London's most popular student neighborhoods, 
            from vibrant Camden to academic Bloomsbury.
          </p>
          <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
            
          </div>
        </div>
      </section>

      {/* =========================
          Features Section
      ========================== */}
      <section aria-labelledby="features-heading" className="bg-white">
        <FeaturesSection />
      </section>

      {/* =========================
          How It Works
      ========================== */}
      <section aria-labelledby="how-it-works-heading" className="bg-gray-50">
        <HowItWorks />
      </section>

      {/* =========================
          Featured Properties
      ========================== */}
      <section className="py-20 bg-white" aria-labelledby="featured-properties-heading">
        <div className="container mx-auto px-4">
          <h2
            id="featured-properties-heading"
            className="text-3xl font-bold text-center mb-4"
          >
            Featured Properties
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Explore a curated selection of quality student-friendly properties around London.
            Each listing highlights proximity to major universities, Tube stations, and 
            popular cultural hotspots—all to help you make a confident decision for 
            your next home.
          </p>
          <FeaturedProperties />
        </div>
      </section>

      {/* =========================
          Testimonials
      ========================== */}
      <section className="py-20 bg-gray-50" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold text-center mb-4"
          >
            What Students Say
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Hear from London students who have successfully used RoomZoom to 
            secure accommodations. Discover how our platform simplifies the 
            search process and saves precious time.
          </p>
          <Testimonials />
        </div>
      </section>

      {/* =========================
          CTA Section
      ========================== */}
      <section
        className="py-20 bg-blue-600 text-white text-center"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="cta-heading" className="text-3xl font-bold mb-6">
            Ready to Find Your New Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who found their ideal London accommodation through
            RoomZoom. With comprehensive property information and a focus on 
            student-friendly locations, we help you discover the perfect spot 
            that fits both your budget and lifestyle.
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold
                       transition-colors duration-300 hover:bg-blue-50 hover:ring-4
                       hover:ring-offset-2 hover:ring-blue-300"
            aria-label="Get Started with RoomZoom"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
} 