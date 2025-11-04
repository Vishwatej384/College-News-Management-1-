import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">College News</h3>
            <p className="text-sm text-gray-400">
              Your trusted source for all college news, events, and updates. Stay connected with your campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/category/academic" className="text-sm hover:text-white transition-colors">Academic</Link></li>
              <li><Link to="/category/events" className="text-sm hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/category/sports" className="text-sm hover:text-white transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/placements" className="text-sm hover:text-white transition-colors">Placements</Link></li>
              <li><Link to="/category/cultural" className="text-sm hover:text-white transition-colors">Cultural</Link></li>
              <li><Link to="/category/research" className="text-sm hover:text-white transition-colors">Research</Link></li>
              <li><Link to="/category/technology" className="text-sm hover:text-white transition-colors">Technology</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} College News Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
