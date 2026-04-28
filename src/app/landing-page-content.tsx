import Link from 'next/link';
import { 
  FileText, 
  ClipboardList, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  FileCheck,
  Zap,
  GraduationCap,
  Rocket,
  Wrench,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const tools = [
    {
      id: 'lab-record-generator',
      title: 'Auto Lab Record Generator',
      description: 'Generate complete lab records with AI including aim, theory, code, graphs, and viva questions. Download as formatted DOCX.',
      icon: FileText,
      status: 'active',
      features: ['AI-Powered Generation', 'Graph Visualization', 'DOCX Export', 'Editable Preview'],
      bgColor: 'bg-amber-200',
      borderColor: 'border-black',
      link: '/tools/lab-record-generator',
    },
    {
      id: 'cgpa-calculator',
      title: 'CGPA Calculator',
      description: 'Calculate your Cumulative Grade Point Average easily. Input your semester grades and credits to track your academic performance.',
      icon: BookOpen,
      status: 'coming-soon',
      features: ['Semester-wise Calculation', 'Grade Tracking', 'Performance Analytics'],
      bgColor: 'bg-gray-200',
      borderColor: 'border-gray-400',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-slate-200 to-stone-200 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Logo/Title */}
              <div className="mb-6">
                <div className="inline-block bg-black text-white px-8 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                    StudentHub
                  </h1>
                </div>
              </div>

              <p className="text-3xl md:text-4xl lg:text-5xl text-black mb-6 font-black leading-tight">
                Your Complete
                <br />
                <span className="text-amber-600">College Companion</span>
                <GraduationCap className="inline w-10 h-10 ml-2" />
              </p>
              
              <p className="text-lg md:text-xl text-gray-800 mb-8 font-medium bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
                AI-powered tools designed to simplify your academic journey. From lab records to exam prep,
                we've got everything you need to excel in college.
              </p>
              
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/tools/lab-record-generator"
                  className="btn-primary text-lg flex items-center gap-2"
                >
                  <Rocket className="w-5 h-5" /> Explore Tools
                </Link>
                <button className="btn-pink text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Learn More
                </button>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '6+', label: 'Tools Available', color: 'bg-amber-200' },
                { number: '100%', label: 'Free to Use', color: 'bg-slate-200' },
                { number: 'AI', label: 'Powered', color: 'bg-stone-200' },
                { number: '24/7', label: 'Available', color: 'bg-emerald-200' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all`}
                >
                  <div className="text-5xl font-black text-black">{stat.number}</div>
                  <div className="text-black font-bold mt-2 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-black mb-6 flex items-center justify-center gap-3">
            Powerful Tools for Students <Wrench className="w-12 h-12" />
          </h2>
          <div className="bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold">
              Everything you need to succeed in your academic journey
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`relative ${tool.bgColor} ${tool.borderColor} border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200`}
            >
              {/* Tool Header */}
              <div className="p-6 border-b-4 border-black">
                <div className="mb-4">
                  <tool.icon className="w-16 h-16" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">{tool.title}</h3>
                {tool.status === 'coming-soon' && (
                  <span className="inline-block px-4 py-2 bg-black text-white font-bold border-2 border-black text-sm">
                    COMING SOON
                  </span>
                )}
                {tool.status === 'active' && (
                  <span className="inline-block px-4 py-2 bg-emerald-300 text-black font-bold border-2 border-black text-sm flex items-center gap-2 w-fit">
                    <Sparkles className="w-4 h-4" /> AVAILABLE NOW
                  </span>
                )}
              </div>

              {/* Tool Content */}
              <div className="p-6">
                <p className="text-black mb-4 font-medium">{tool.description}</p>
                <ul className="space-y-3 mb-6">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm font-bold text-black">
                      <span className="w-3 h-3 bg-black inline-block"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {tool.status === 'active' ? (
                  <Link
                    href={tool.link}
                    className="block w-full px-6 py-4 bg-yellow-400 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                  >
                    USE TOOL →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full px-6 py-4 bg-gray-300 text-gray-600 font-black border-4 border-gray-400 cursor-not-allowed"
                  >
                    COMING SOON
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t-4 border-black bg-gradient-to-r from-amber-200 via-slate-200 to-stone-200 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-black mb-6 flex items-center justify-center gap-3">
            Ready to Supercharge Your Studies? <Rocket className="w-12 h-12" />
          </h2>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <p className="text-xl font-bold text-black">
              Join thousands of students who are already using StudHub to excel in their academics
            </p>
          </div>
          <Link
            href="/tools/lab-record-generator"
            className="inline-block px-12 py-6 bg-black text-white font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-xl flex items-center gap-3 mx-auto"
          >
            GET STARTED FREE <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
