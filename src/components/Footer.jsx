import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* School Highlights Row */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <CheckCircle2 className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm">Classes 1 to 10</h4>
                <p className="text-xs text-slate-500 mt-0.5">CBSE Standards Curriculum</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm">Sports Facilities</h4>
                <p className="text-xs text-slate-500 mt-0.5">Physical Development Programs</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <CheckCircle2 className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm">Indoor Activities</h4>
                <p className="text-xs text-slate-500 mt-0.5">Chess, Art, Music & More</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm">Expert Faculty</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dedicated Educators & Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* School Brief */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-amber-500" />
              <h3 className="text-white font-extrabold text-lg tracking-tight">
                TINY <span className="text-amber-500">SCHOLARS</span>
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Nurturing young minds to build a brighter tomorrow. Tiny Scholars School provides holistic K-10 education focusing on academic rigor, physical health, and creative expression.
            </p>
            <div className="text-xs font-semibold text-slate-500 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 w-fit">
              <span>School Code: TS-HYD-048</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-sans">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-white transition-colors">Curriculum</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">Student Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Admissions & Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-sans">Admissions</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors">Admission Procedure</Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors">Eligibility Criteria</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Online Enquiry</Link>
              </li>
              <li>
                <Link to="/about#office-hours" className="hover:text-white transition-colors">Visit School campus</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Office Hours */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-sans">Contact Us</h4>
            
            <div className="flex gap-2.5 text-sm items-start">
              <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-sans">
                39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048
              </span>
            </div>

            <div className="flex gap-2.5 text-sm items-center">
              <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span>+91 801-926-2969</span>
            </div>

            <div className="flex gap-2.5 text-sm items-center">
              <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <a href="mailto:contactus@tinyscholarshighschool.com" className="hover:text-white transition-colors">
                contactus@tinyscholarshighschool.com
              </a>
            </div>

            <div className="flex gap-2.5 text-sm items-start border-t border-slate-800 pt-3 mt-3">
              <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5 text-slate-500">
                <span className="block font-semibold text-slate-400">Office Hours:</span>
                <span className="block">Mon–Thu: 9:00 am – 5:00 pm</span>
                <span className="block">Sat: 9:00 am – 3:00 pm</span>
                <span className="block">Sun: Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Tiny Scholars High School. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span>Attapur, Hyderabad, India</span>
            <span className="text-amber-500 font-semibold font-sans">"Empowering the Future, One Scholar at a Time"</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
