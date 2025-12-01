import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Global Trade Corp",
    role: "Supply Chain Manager",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20businesswoman%20headshot%2C%20confident%20smile%2C%20corporate%20attire%2C%20neutral%20background&image_size=square",
    rating: 5,
    text: "Logico has transformed our supply chain operations. Their attention to detail and commitment to timely delivery is unmatched. Highly recommend their services!"
  },
  {
    name: "Michael Chen",
    company: "Tech Innovations Ltd",
    role: "Operations Director",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Asian%20businessman%20headshot%2C%20confident%20expression%2C%20modern%20suit%2C%20clean%20background&image_size=square",
    rating: 5,
    text: "Outstanding service and reliability. Logico's team went above and beyond to ensure our critical shipments arrived on time. Their tracking system is excellent."
  },
  {
    name: "Emily Rodriguez",
    company: "Fashion Forward Inc",
    role: "Logistics Coordinator",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20Hispanic%20woman%20headshot%2C%20warm%20smile%2C%20business%20attire%2C%20professional%20lighting&image_size=square",
    rating: 5,
    text: "The best logistics partner we've ever worked with. Their customer service is exceptional, and they always find solutions to our complex shipping needs."
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-xl text-gray-700 text-center mb-8 italic">
              "{testimonials[currentIndex].text}"
            </blockquote>
            
            <div className="flex items-center justify-center">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <div className="font-bold text-gray-900">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentIndex].role}
                </div>
                <div className="text-blue-600 font-medium">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}