import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img src="/logo.png" alt="WAHL" className="h-12 w-auto mb-2" />
              <div className="text-sm text-gray-400">Logistics Solutions</div>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted partner for comprehensive logistics solutions. 
              We deliver excellence with every shipment, ensuring your cargo reaches its destination safely and on time.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  Ground Transportation
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  Ocean Freight
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  Air Freight
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  Warehousing
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  Supply Chain Management
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">Dammam</div>
                  <div className="text-gray-300">Eastern Province</div>
                  <div className="text-gray-300">Saudi Arabia</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">+966 12 345 6789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">info@wahl.sa</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">Mon-Fri: 8:00-18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 WAHL Logistics Solutions. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                Privacy Policy
              </span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                Terms of Service
              </span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
