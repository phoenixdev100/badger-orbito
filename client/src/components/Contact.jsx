import React from "react";

const Contact = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">Get in Touch</h2>
          <p className="mt-3 text-sm sm:text-base text-black/70">Have questions? We're here for you. Drop us a line, write us an email, or send us a text.</p>
        </div>

        <div className="rounded-2xl bg-white shadow-[0_6px_30px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-black text-white p-8 sm:p-10 relative">
              <h3 className="text-2xl font-semibold">Contact Information</h3>
              <p className="mt-2 text-white/70">Your achievements deserve an audience</p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/90"><path d="M4 4h16v16H4z" opacity="0"/><path d="M4 4l8 8 8-8"/><path d="M22 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6"/></svg>
                  </span>
                  <span className="text-white/90">badger@support.com</span>
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
                  <div className="border-b border-black/20 pb-2">
                    <label className="text-sm text-black/70">Name</label>
                    <input type="text" className="mt-2 w-full bg-transparent outline-none" placeholder="" />
                  </div>
                  <div className="border-b border-black/20 pb-2">
                    <label className="text-sm text-black/70">Email</label>
                    <input type="email" className="mt-2 w-full bg-transparent outline-none" placeholder="" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border-b border-black/20 pb-2 sm:col-span-2">
                    <label className="text-sm text-black/70">Product Question</label>
                    <select className="mt-2 w-full bg-transparent outline-none">
                      <option className="text-black">General</option>
                      <option className="text-black">Pricing</option>
                      <option className="text-black">Technical</option>
                    </select>
                  </div>
                </div>

                <div className="border-b border-black/20 pb-2">
                  <label className="text-sm text-black/70">Message</label>
                  <textarea rows={2} className="mt-2 w-full bg-transparent outline-none" placeholder="Write your message.." />
                </div>

                <div className="flex items-start gap-3">
                  <input id="subscribe" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/30" />
                  <label htmlFor="subscribe" className="text-sm text-black/80">Subscribe to receive the latest news and exclusive offers</label>
                </div>


                <div>
                  <button type="button" className="inline-flex items-center justify-center rounded-md bg-black text-white px-6 py-3 text-sm font-medium hover:bg-black/90 transition">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
