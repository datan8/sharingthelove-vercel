import { Link } from "react-router-dom";
import { env } from "@/lib/env";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Sharing the Love</h3>
            <p className="mb-6 text-gray-700">
              Premium organic products that transform lives. 100% of profits fund food, education and healthcare for sixty-four orphans in Viet Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-brandGold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-700 hover:text-brandGold transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-700 hover:text-brandGold transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-brandGold transition-colors">Contact</Link>
              </li>
            </ul>
          </div>


          {/* Contact */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${env.contactEmail}`} className="text-gray-700 hover:text-brandGold transition-colors">
                  {env.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-700">
            © {currentYear} Sharing the Love. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
