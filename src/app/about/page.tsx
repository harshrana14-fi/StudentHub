import Link from 'next/link';
import { Heart, Code, GraduationCap, Rocket, ArrowLeft, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-slate-200 to-stone-200 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold mb-8"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
          
          <div className="text-left">
            <div className="inline-block bg-black text-white px-8 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                About StudHub
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-black font-black leading-tight max-w-3xl">
              Empowering students with <span className="text-amber-600">AI-powered tools</span> for academic success
            </p>
          </div>
        </div>
      </div>

      {/* Creator Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Info */}
            <div>
              <div className="inline-block px-3 py-1.5 bg-amber-300 border-2 border-black font-bold text-xs mb-4">
                CREATED BY
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
                Harsh Rana
              </h2>
              <p className="text-base text-gray-800 mb-4 font-medium">
                StudHub is a passion project built to help students navigate their academic journey with ease. 
                As a student myself, I understand the challenges of managing lab records, assignments, and exam preparation.
              </p>
              <p className="text-base text-gray-800 mb-6 font-medium">
                My goal is to create free, AI-powered tools that make student life simpler and more efficient. 
                Every tool on this platform is designed with students in mind - practical, powerful, and completely free.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 border-2 border-black">
                  <Code className="w-4 h-4" />
                  <span className="font-bold text-sm">Developer</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-stone-200 border-2 border-black">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-bold text-sm">Student</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-200 border-2 border-black">
                  <Heart className="w-4 h-4" />
                  <span className="font-bold text-sm">Passionate</span>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="bg-gradient-to-br from-amber-200 to-slate-200 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-white border-2 border-black p-6">
                <div className="text-center">
                  <div className="inline-block bg-black text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-3">
                    <h3 className="text-xl font-black">Harsh Rana</h3>
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-4">Creator & Developer</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-left px-3 py-2 bg-amber-200 border-2 border-black">
                      <Rocket className="w-4 h-4" />
                      <span className="font-bold text-xs">Building tools for students</span>
                    </div>
                    <div className="flex items-center gap-2 text-left px-3 py-2 bg-slate-200 border-2 border-black">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold text-xs">AI-powered solutions</span>
                    </div>
                    <div className="flex items-center gap-2 text-left px-3 py-2 bg-stone-200 border-2 border-black">
                      <Heart className="w-4 h-4" />
                      <span className="font-bold text-xs">Free for everyone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Our Mission <Rocket className="inline w-10 h-10" />
          </h2>
          <div className="bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold">
              Making education accessible and efficient through technology
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Free Tools',
              description: 'All our tools are completely free to use. No hidden charges, no premium plans - just pure value for students.',
              icon: GraduationCap,
              bgColor: 'bg-amber-200',
            },
            {
              title: 'AI-Powered',
              description: 'We leverage cutting-edge AI technology to generate high-quality content that saves you hours of work.',
              icon: Sparkles,
              bgColor: 'bg-slate-200',
            },
            {
              title: 'Student First',
              description: 'Every feature is designed based on real student needs and feedback. Built by a student, for students.',
              icon: Heart,
              bgColor: 'bg-stone-200',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${item.bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8`}
              >
                <div className="mb-6">
                  <Icon className="w-16 h-16" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-black mb-4">{item.title}</h3>
                <p className="text-black font-medium">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t-4 border-black bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
              Built With Modern Tech <Code className="inline w-10 h-10" />
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js', color: 'bg-amber-200' },
              { name: 'TypeScript', color: 'bg-slate-200' },
              { name: 'Tailwind CSS', color: 'bg-stone-200' },
              { name: 'Groq AI', color: 'bg-emerald-200' },
            ].map((tech, index) => (
              <div
                key={index}
                className={`${tech.color} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center`}
              >
                <div className="text-xl font-black text-black">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t-4 border-black bg-gradient-to-r from-amber-200 via-slate-200 to-stone-200 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Ready to Get Started? <Sparkles className="inline w-10 h-10" />
          </h2>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <p className="text-xl font-bold text-black">
              Explore our AI-powered tools and supercharge your academic journey
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-block px-12 py-6 bg-black text-white font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl"
          >
            EXPLORE TOOLS →
          </Link>
        </div>
      </div>


    </div>
  );
}
