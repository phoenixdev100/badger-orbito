import React from "react";

const Contact = () => {
  return (
    <section className="relative w-full bg-black py-16 sm:py-20 md:py-24 text-white">
      {/* Full-width animated grid background (match FAQ) */}
      <style>{`
        @keyframes grid-draw-contact { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
        .grid-line-contact { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw-contact 2s ease-out forwards; }
        .detail-dot-contact { fill: #cbd5e1; opacity: 0; animation: grid-draw-contact 2.4s ease-out forwards; }
        @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
      `}</style>
      <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="gridReactDarkResponsiveContact" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridReactDarkResponsiveContact)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line-contact" style={{ animationDelay: '0.5s' }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line-contact" style={{ animationDelay: '1s' }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line-contact" style={{ animationDelay: '1.5s' }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line-contact" style={{ animationDelay: '2s' }} />
        <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line-contact" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
        <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line-contact" style={{ animationDelay: '3s', opacity: '0.05' }} />
        <circle cx="20%" cy="20%" r="1.5" className="detail-dot-contact" style={{ animationDelay: '3s' }} />
        <circle cx="80%" cy="20%" r="1.5" className="detail-dot-contact" style={{ animationDelay: '3.2s' }} />
        <circle cx="20%" cy="80%" r="1.5" className="detail-dot-contact" style={{ animationDelay: '3.4s' }} />
        <circle cx="80%" cy="80%" r="1.5" className="detail-dot-contact" style={{ animationDelay: '3.6s' }} />
        <circle cx="50%" cy="50%" r="1.2" className="detail-dot-contact" style={{ animationDelay: '4s' }} />
      </svg>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="relative overflow-visible">
          {/* Corner elements (match FAQ) */}
          <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6" style={{ animationDelay: '4s' }}>
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate top-4 left-[1%]" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-2 right-63" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="relative z-10 text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">Get in Touch</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">Have questions? We're here for you. Drop us a line, write us an email, or send us a text.</p>
          </div>

          <div className="relative z-10 rounded-2xl bg-[#0b0b0d] ring-1 ring-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-black text-white p-8 sm:p-10 relative">
                <h3 className="text-2xl font-semibold">Contact Information</h3>
                <p className="mt-2 text-white/70">Your achievements deserve an audience</p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/90"><path d="M4 4h16v16H4z" opacity="0"/><path d="M4 4l8 8 8-8"/><path d="M22 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6"/></svg>
                    </span>
                    <span className="text-white/90">support@orbito.space</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/90"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <span className="text-white/90">Greater Noida, Uttar Pradesh, India</span>
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/90"><path d="M9.04 21V8.51H5.5V21h3.54zM7.27 7.02c1.22 0 1.98-.81 1.98-1.83-.02-1.04-.76-1.83-1.96-1.83S5.31 4.15 5.31 5.2c0 1.02.76 1.82 1.92 1.82h.04zM18.71 21h3.54V14.9c0-3.26-1.74-4.78-4.06-4.78-1.88 0-2.72 1.03-3.19 1.75v-1.52h-3.54c.05 1.01 0 10.65 0 10.65h3.54V15c0-.32.02-.64.12-.87.27-.64.9-1.3 1.96-1.3 1.38 0 1.93 0 1.93 2.09V21z"/></svg>
                  </a>
                  
                  <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/90"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.91A12.15 12.15 0 0 1 3.15 4.6a4.28 4.28 0 0 0 1.32 5.71 4.24 4.24 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.44 4.19 4.3 4.3 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.7 8.7 0 0 0 22.46 6z"/></svg>
                  </a>
                </div>

                <div className="absolute -bottom-24 -right-20 pointer-events-none select-none hidden sm:block">
                  <div className="relative h-64 w-64">
                    <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-white/10" />
                    <div className="absolute -top-8 -left-6 h-32 w-32 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="border-b border-white/20 pb-2">
                      <label className="text-sm text-slate-300">Name</label>
                      <input type="text" className="mt-2 w-full bg-transparent outline-none text-white placeholder-white/60" placeholder="" />
                    </div>
                    <div className="border-b border-white/20 pb-2">
                      <label className="text-sm text-slate-300">Email</label>
                      <input type="email" className="mt-2 w-full bg-transparent outline-none text-white placeholder-white/60" placeholder="" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="border-b border-white/20 pb-2 sm:col-span-2">
                      <label className="text-sm text-slate-300">Product Question</label>
                      <select className="mt-2 w-full bg-transparent outline-none text-white">
                        <option className="text-black">General</option>
                        <option className="text-black">Pricing</option>
                        <option className="text-black">Technical</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-b border-white/20 pb-2">
                    <label className="text-sm text-slate-300">Message</label>
                    <textarea rows={2} className="mt-2 w-full bg-transparent outline-none text-white placeholder-white/60" placeholder="Write your message.." />
                  </div>

                  <div className="flex items-start gap-3">
                    <input id="subscribe" type="checkbox" className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent" />
                    <label htmlFor="subscribe" className="text-sm text-slate-200">Subscribe to receive the latest news and exclusive offers</label>
                  </div>

                  <div>
                    <button type="button" className="inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
