import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Reliable Logistics
            <br />
            <span className="text-blue-300">Solutions Worldwide</span>
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl">
            Delivering excellence in freight forwarding, supply chain management, 
            and transportation services with over 20 years of industry experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200">
              <span>Get a Quote</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200">
              <Play className="h-5 w-5" />
              <span>Watch Video</span>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">500+</div>
            <div className="text-blue-100">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">20+</div>
            <div className="text-blue-100">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">1000+</div>
            <div className="text-blue-100">Projects Done</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">50+</div>
            <div className="text-blue-100">Countries Served</div>
          </div>
        </div>
      </div>
    </section>
  );
}