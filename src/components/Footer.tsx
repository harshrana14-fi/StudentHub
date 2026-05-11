import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-8 border-black relative">
      {/* Decorative top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left Side: Brand & Mission */}
          <div className="flex flex-col items-start">
            <div className="bg-white text-black inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] mb-4">
              <h3 className="text-xl font-black uppercase tracking-tighter italic">StudHub</h3>
            </div>
            <p className="text-lg font-bold tracking-tight max-w-xs leading-tight">
              Empowering students with AI-powered academic tools
            </p>
          </div>

          {/* Right Side: Credits & Legal */}
          <div className="flex flex-col items-start md:items-end">
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
              Created with ❤️ by <span className="text-white">Harsh Rana</span>
            </p>
            <div className="flex gap-4 mb-6">
              <Link href="/about" className="text-xs font-bold hover:text-amber-400 transition-colors">ABOUT</Link>
              <Link href="/tools" className="text-xs font-bold hover:text-amber-400 transition-colors">TOOLS</Link>
              <Link href="/contact" className="text-xs font-bold hover:text-amber-400 transition-colors">CONTACT</Link>
            </div>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest border-t border-white/10 pt-4 w-full md:w-auto text-left md:text-right">
              © 2026 StudHub. Built for the next generation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
