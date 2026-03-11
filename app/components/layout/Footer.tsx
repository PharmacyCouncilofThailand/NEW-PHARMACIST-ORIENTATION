"use client";

import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import VisitorCounter from "../effects/VisitorCounter";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative pt-24 pb-10 overflow-hidden text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent,white_90%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          
          {/* Left Column: Brand & Contact & Map (Mobile) */}
          <div className="space-y-10">
            {/* Brand */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 flex items-center justify-center p-1.5">
                <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council" width={70} height={70} className="rounded-xl object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">{t("footer.brandName")}</h3>

              </div>
            </div>

            {/* Address & Contact */}
            <div className="space-y-6 pl-2">
              <div className="flex gap-4 items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 text-xs shrink-0 mt-1">📍</span>
                  <p className="text-sm leading-relaxed max-w-md">{t("footer.address")}</p>
              </div>
              
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                 <div className="flex gap-4 items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 text-xs shrink-0">📞</span>
                    <span className="text-sm font-medium">0 2591 9992</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 text-xs shrink-0">✉️</span>
                    <span className="text-sm font-medium">pharthai@pharmacycouncil.org</span>
                 </div>
              </div>
            </div>
            
            {/* Socials */}
            <div className="flex gap-4 pt-2">
               <a
                 href="https://www.facebook.com/thaipharmacycouncil"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 transition-all duration-300 shadow-sm group"
                 aria-label="Facebook"
               >
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
               </a>
               <a
                 href="https://www.instagram.com/pharmacycouncilth/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-[#dc2743] hover:scale-110 transition-all duration-300 shadow-sm group"
                 aria-label="Instagram"
               >
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm-1.669.991c-2.618 0-2.924.01-3.957.058-.971.045-1.503.207-1.855.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.886-.344 1.855-.047 1.035-.058 1.341-.058 3.96v.625c0 2.627.011 2.933.058 3.967.045.961.207 1.493.344 1.845.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.886.3 1.855.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.886.344-1.855.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.886-.3-1.855-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
               </a>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="w-full h-[300px] lg:h-auto min-h-[300px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 relative group">
             {/* Map Placeholder */}
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.8620801190245!2d100.52762687468208!3d13.847316186554584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b5cb4ca105b%3A0xb3aaa2c0ba72d485!2z4Liq4Lig4Liy4LmA4Lig4Liq4Lix4LiK4LiB4Lij4Lij4Lih!5e0!3m2!1sth!2sth!4v1771299997803!5m2!1sth!2sth" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
             ></iframe>
             

          </div>

        </div>

        {/* Visitor Counter */}
        <VisitorCounter />

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-200 dark:border-slate-800/50">
          <p className="text-xs font-medium opacity-60">© 2026 Pharmacy Department. All rights reserved.</p>
          
          <div className="flex gap-3">
             {[
               { label: t("nav.home"), href: "#hero" },
               { label: t("nav.welcome"), href: "#welcome" },
               { label: t("nav.speakers"), href: "#speakers" },
               { label: t("nav.agenda"), href: "#agenda" },
               { label: t("nav.gallery"), href: "#memories" },
               { label: t("nav.career"), href: "#job-posters" },
               { label: t("nav.sponsors"), href: "#sponsors" }
             ].map(item => (
                <a key={item.label} href={item.href} className="px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors">
                  {item.label}
                </a>
             ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
