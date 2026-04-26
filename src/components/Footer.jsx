import { Link } from "react-router-dom";
import { Facebook, Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white mt-20 border-t border-gray-100 text-gray-900">
      
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* Logo + About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter text-blue-600">
            GOOGIZ
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            GOOGIZ is a free online toolbox where you can edit images,
            convert PDFs, process videos, audio and many useful utilities
            directly in your browser. Fast, secure and easy to use.
          </p>
        </div>

        {/* Tools Categories */}
        <div>
          <h3 className="font-bold mb-5 text-gray-900">Tools Categories</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <Link to="/ai-tools" className="hover:text-blue-600 transition-colors font-semibold text-blue-600 flex items-center gap-1">
                AI Magic ✨
              </Link>
            </li>
            <li>
              <Link to="/image-tools" className="hover:text-blue-600 transition-colors">Image Tools</Link>
            </li>
            <li>
              <Link to="/pdf-tools" className="hover:text-blue-600 transition-colors">PDF Tools</Link>
            </li>
            <li>
              <Link to="/video-tools" className="hover:text-blue-600 transition-colors">Video Tools</Link>
            </li>
            <li>
              <Link to="/audio-tools" className="hover:text-blue-600 transition-colors">Audio Tools</Link>
            </li>
            <li>
              <Link to="/utility-tools" className="hover:text-blue-600 transition-colors">Utility Tools</Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-bold mb-5 text-gray-900">Company</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Support & Socials */}
        <div>
          <h3 className="font-bold mb-5 text-gray-900">Support</h3>
          <p className="text-sm text-gray-600 mb-6">
            Need help or have suggestions?  
            Contact our support team anytime.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            Contact Support
          </Link>

          {/* Social Icons */}
          <div className="flex gap-5 mt-8 text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-black transition-colors" aria-label="Github">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-red-500 transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} GOOGIZ — All Rights Reserved.</p>
          <p className="text-xs italic text-gray-400">Built for speed & security.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;