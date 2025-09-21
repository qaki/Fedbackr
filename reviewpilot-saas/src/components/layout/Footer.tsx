"use client";

import Link from "next/link";
import { ExternalLink, Heart, Shield, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ReviewPilot</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered review management for businesses. Monitor, respond, and grow your online reputation.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for businesses worldwide</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/reviews" className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-400 hover:text-white transition-colors">
                  Reports
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://status.reviewpilot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Shield className="h-4 w-4" />
                  <span>Status</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@reviewpilot.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.reviewpilot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} ReviewPilot. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center space-x-1 text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
