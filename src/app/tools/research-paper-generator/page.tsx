'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  RefreshCw, 
  BookOpen, 
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  User,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface ResearchPaper {
  title: string;
  abstract: string;
  introduction: string;
  literatureReview: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string[];
  tableData?: { [key: string]: string | number }[];
  chartData?: { name: string; value: number }[];
}

export default function ResearchPaperGenerator() {
  const [topic, setTopic] = useState('');
  const [academicLevel, setAcademicLevel] = useState('undergraduate');
  const [humanizeIntensity, setHumanizeIntensity] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [paperFormat, setPaperFormat] = useState('apa');
  const [isDownloading, setIsDownloading] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!paper) return;
    
    setIsDownloading(true);
    try {
      let chartImage = null;
      let diagramImage = null;

      // Capture chart
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        chartImage = canvas.toDataURL('image/png');
      }

      // Capture diagram
      if (diagramRef.current) {
        const canvas = await html2canvas(diagramRef.current, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        diagramImage = canvas.toDataURL('image/png');
      }

      const response = await fetch('/api/research/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paper,
          format: paperFormat,
          chartImage,
          diagramImage
        }),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-research-paper.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to download the paper. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a research topic');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Simulating API call for demonstration
    // In a real app, this would call /api/research/generate
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const cleanTopic = topic.trim();
      const topicLower = cleanTopic.toLowerCase();
      
      const mockPaper: ResearchPaper = {
        title: cleanTopic,
        abstract: `This comprehensive and in-depth research paper provides an exhaustive investigation into the multi-dimensional facets of ${cleanTopic}. As the global academic and industrial landscapes undergo rapid transformations, the critical importance of ${topicLower} has emerged as a central theme of modern discourse. This study utilizes a sophisticated, multi-layered analytical framework to meticulously examine how contemporary methodologies intersect with long-standing historical paradigms. Through a series of rigorous empirical evaluations, theoretical syntheses, and comparative analyses, we demonstrate that the optimization of ${topicLower} is not merely a technical requirement but a fundamental pillar of progress. The findings of this research provide an extensive and nuanced roadmap for future investigations, highlighting the delicate balance between immediate efficiency and long-term strategic sustainability in the field of ${topicLower}.`,
        
        introduction: `The emergence of ${cleanTopic} has profoundly altered the trajectory of modern thought and practice. For several decades, researchers and practitioners alike have grappled with the inherent complexities of this domain, yet a truly holistic understanding has remained elusive until now. In this extensive paper, we argue that the prevailing approaches to ${topicLower} necessitate a fundamental and systemic shift toward more integrated models.\n\n### 1.1 Contextual Background\nHistorically, ${topicLower} was viewed through a narrow lens, often relegated to a secondary consideration in broader systems. However, with the advent of high-precision tools and the globalization of knowledge, the paradigm has shifted. We now recognize that ${topicLower} is at the heart of systemic efficiency. This section explores the historical evolution of ${topicLower}, tracing its roots back to the early foundational theories and showing how those theories have been adapted to meet the challenges of the 21st century.\n\n### 1.2 Problem Statement\nDespite the significant advances made in recent years, several critical gaps remain. Specifically, the integration of ${topicLower} into existing workflows often lacks a cohesive strategy, leading to fragmented outcomes and suboptimal performance. This research addresses these gaps by proposing a new, unified framework for ${topicLower} that prioritizes both technical excellence and human-centric design. We explore why previous attempts at solving these issues have fallen short and how our proposed approach overcomes those limitations.\n\n### 1.3 Research Objectives\nThe primary objective of this study is to provide a definitive analysis of ${topicLower}. To achieve this, we have established four key goals: first, to synthesize the existing body of knowledge; second, to identify the primary drivers of success in ${topicLower}; third, to evaluate the impact of contemporary methodologies; and fourth, to project the future trajectory of the field. Each of these objectives is explored in detail in the subsequent sections of this paper.`,
        
        literatureReview: `The body of literature surrounding ${cleanTopic} is as vast as it is diverse, reflecting the interdisciplinary nature of the field. Early pioneers focused almost exclusively on the basic mechanics of ${topicLower}, establishing a solid foundation that continues to support modern research. However, as the field has matured, the focus has shifted toward more complex and integrated systems.\n\n### 2.1 The Evolution of Theory\nIn the early stages, ${topicLower} was primarily understood through the lens of traditional models. Smith (1998) argued that the primary constraint on ${topicLower} was technological. Yet, as demonstrated by the work of Jones and Miller (2005), the human element is equally, if not more, critical. This review examines these early theories and shows how they have been expanded by more recent scholarship. We highlight the move from static models to dynamic, adaptive systems that can respond to real-time changes in the environment.\n\n### 2.2 Contemporary Perspectives\nMore recent scholarship has moved toward a socio-technical approach to ${topicLower}. According to Smith et al. (2022), the primary challenge in the current landscape is the lack of standardized metrics for evaluating success. This sentiment is echoed by Johnson (2023), who argues that the qualitative dimensions of ${topicLower} are frequently overlooked in favor of purely quantitative data. Our review of the literature suggests a growing consensus on the need for more interdisciplinary collaboration, particularly between technical experts and social scientists.\n\n### 2.3 Identification of Gaps\nDespite the wealth of existing research, several areas remain under-explored. For instance, the long-term impact of ${topicLower} on organizational culture is a topic that has received relatively little attention. Furthermore, the relationship between ${topicLower} and environmental sustainability represents a critical frontier that is only just beginning to be explored. This review identifies these gaps and situates our current research within that context, showing how our findings help to complete the picture.`,
        
        methodology: `To achieve the necessary depth and breadth of analysis for ${cleanTopic}, a robust and comprehensive mixed-methods research design was meticulously implemented. This approach was chosen specifically for its ability to provide both the deep qualitative insights required for understanding complex human interactions and the broad quantitative validation needed for technical verification.\n\n### 3.1 Research Design and Framework\nThe study was structured as a multi-phase investigation conducted over a period of eight months. We utilized a longitudinal design to track the evolution of ${topicLower} over time, allowing us to identify patterns that might be missed in a single-point-in-time study. The framework was built upon three key pillars: empirical observation, theoretical modeling, and experimental validation.\n\n### 3.2 Data Collection Processes\nData collection was carried out in three distinct phases. Phase one involved a systematic and exhaustive review of academic databases, including IEEE Xplore, JSTOR, and Google Scholar. We filtered for high-impact studies published within the last seven years to ensure the relevance of our findings. Phase two consisted of primary data collection through a series of 50 structured interviews with industry experts and academic leaders in the field of ${topicLower}. These interviews provided invaluable first-hand accounts of the practical challenges and emerging trends. Phase three involved the collection of quantitative performance metrics from a series of controlled testing environments, where different models of ${topicLower} were evaluated under varying conditions.\n\n### 3.3 Analytical Procedures\nThe analysis of the collected data was performed using a combination of thematic synthesis for qualitative data and advanced statistical modeling for quantitative data. We utilized industry-standard software to ensure the accuracy and reliability of our results. Triangulation of data from different sources was employed to validate the findings and ensure a holistic perspective on ${topicLower}.`,
        
        results: `The results of our extensive investigation into ${cleanTopic} reveal several highly significant and multifaceted trends. These findings provide strong empirical support for our initial hypothesis while also uncovering unexpected dynamics that challenge existing assumptions about ${topicLower}.\n\n### 4.1 Quantitative Performance Metrics\nOur statistical analysis revealed a 35% improvement in overall system efficiency when the proposed models of ${topicLower} were implemented. This improvement was consistent across different testing environments, suggesting a high degree of generalizability for our findings. Furthermore, we observed a significant correlation between the optimization of ${topicLower} and a reduction in long-term operational costs, providing a clear economic incentive for the adoption of our proposed framework.\n\n### 4.2 Qualitative Insights from Expert Interviews\nThe thematic analysis of our expert interviews provided a wealth of nuanced information. Experts consistently highlighted that the single most important variable in the success of ${topicLower} is the degree of integration between technical systems and human operators. While automation provides consistency, the decision-making capability of humans is irreplaceable in complex, high-stakes scenarios. This section explores these expert perspectives in detail, providing a rich narrative that complements the quantitative data.\n\n### 4.3 Longitudinal Observations\nBy tracking ${topicLower} over an eight-month period, we were able to observe the stabilization of performance over time. Our data shows that while initial implementation may involve a learning curve, the long-term benefits far outweigh the initial investment. We also identified several key 'inflection points' where minor adjustments to ${topicLower} led to disproportionately large improvements in output.`,
        
        discussion: `The implications of our findings for the field of ${cleanTopic} are profound and far-reaching. The observed improvements in efficiency and cost-effectiveness suggest that there is still immense untapped potential within current frameworks of ${topicLower}.\n\n### 5.1 Re-evaluating Existing Paradigms\nOur results challenge the traditional view that ${topicLower} is a purely technical challenge. By demonstrating the critical role of the human element, we provide a strong argument for a more balanced approach that prioritizes socio-technical integration. This section discusses how our findings align with or contradict existing theories in the literature, providing a critical evaluation of the current state of the field.\n\n### 5.2 Ethical and Practical Considerations\nAs the implementation of ${topicLower} becomes more pervasive, the ethical dimensions of these developments must be addressed. We explore the questions of transparency, accountability, and the potential for bias in automated systems. Our discussion advocates for a framework of 'responsible innovation' that ensures ${topicLower} is used in a way that benefits all stakeholders. We also provide practical recommendations for practitioners looking to implement our findings in real-world settings.\n\n### 5.3 Future Directions and Sustainability\nThe intersection of ${topicLower} and environmental sustainability represents one of the most exciting frontiers for future research. Our data suggests that more efficient systems are inherently more sustainable, yet much work remains to be done in quantifying this relationship. This section outlines a roadmap for future investigations, identifying the key questions that still need to be answered and the potential impact of ${topicLower} on the global effort to achieve sustainability goals.`,
        
        conclusion: `In conclusion, this extensive research paper has provided a definitive and human-centric analysis of ${cleanTopic}. Through a combination of rigorous methodology, in-depth literature review, and critical discussion, we have achieved a deeper and more nuanced understanding of this complex and rapidly evolving field.\n\nOur findings demonstrate that the future of ${topicLower} lies in the successful integration of advanced technical systems with human expertise and ethical frameworks. While significant challenges remain, the opportunities for progress and innovation are immense. It is our hope that this paper serves as a foundational resource for current researchers and a source of inspiration for the next generation of students and professionals who will continue to push the boundaries of what is possible in the field of ${topicLower}.\n\nUltimately, the journey of ${topicLower} is one of continuous discovery and refinement. By embracing a spirit of curiosity, commitment, and interdisciplinary collaboration, we can ensure that ${topicLower} remains a powerful force for positive change in our world for years to come.`,
        
        references: [
          "Smith, J. A. (2022). Foundations of Modern Research: A Comprehensive Guide. Academic Press.",
          "Johnson, L. M. (2023). Quantitative vs. Qualitative: A New Synthesis for the 21st Century. Journal of Advanced Studies.",
          "Brown, R., & Davis, S. (2024). The Future of Innovation and Strategic Thinking. Tech Insights Quarterly.",
          "Miller, T. P. (2021). Systems Theory and Practical Application. University of London Press.",
          "Garcia, E. S. (2023). Ethics in the Age of Global Technology. International Review of Philosophy.",
          "Thompson, W. (2024). Sustainability Metrics for Modern Industry. Environmental Science Today.",
          "National Academic Review (2024). Trends in Scholarly Work: A Decadal Perspective.",
          "GGSIPU Research Journal (2023). Special Issue on Academic Excellence and Technological Integration.",
          "Williams, D. (2022). The Human Element in Technical Systems. Psychology and Industry Monthly."
        ],
        tableData: [
          { Parameter: "Base Efficiency", Current: "64%", Proposed: "89%", Improvement: "+25%" },
          { Parameter: "Latency (ms)", Current: "450ms", Proposed: "120ms", Improvement: "-73%" },
          { Parameter: "Cost/Unit", Current: "$12.40", Proposed: "$8.10", Improvement: "-34%" },
          { Parameter: "Reliability", Current: "92.4%", Proposed: "99.1%", Improvement: "+6.7%" }
        ],
        chartData: [
          { name: 'Trial 1', value: 400 },
          { name: 'Trial 2', value: 300 },
          { name: 'Trial 3', value: 600 },
          { name: 'Trial 4', value: 800 },
          { name: 'Trial 5', value: 500 },
        ]
      };
      
      setPaper(mockPaper);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b-4 border-black p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 text-black">
          <Link 
            href="/" 
            className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 border-2 border-black">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Research Gen <span className="text-rose-500 underline decoration-4 underline-offset-4">PRO</span></h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-100 border-2 border-black px-3 py-1">
             <CheckCircle2 className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-black uppercase tracking-widest">HUMANIZED ENGINE V2.1</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-rose-500" /> Generate Paper
                </h2>
                <p className="text-gray-600 font-medium text-sm italic">Enter your topic and let our engine draft a human-toned academic paper.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-2">Research Topic</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The impact of social media on teenage mental health..."
                    className="w-full bg-[#f8f8f8] border-2 border-black p-4 font-bold focus:bg-white focus:ring-0 outline-none transition-all resize-none h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase mb-2">Academic Level</label>
                    <select 
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="w-full bg-[#f8f8f8] border-2 border-black p-3 font-bold focus:bg-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="highschool">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate/PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-2">Citation Style</label>
                    <select 
                      value={paperFormat}
                      onChange={(e) => setPaperFormat(e.target.value)}
                      className="w-full bg-[#f8f8f8] border-2 border-black p-3 font-bold focus:bg-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="apa">APA 7th Edition</option>
                      <option value="mla">MLA 9th Edition</option>
                      <option value="ieee">IEEE (Two-Column)</option>
                      <option value="harvard">Harvard</option>
                    </select>
                  </div>
                </div>

                <div className="bg-rose-50 border-4 border-black p-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black uppercase flex items-center gap-2 text-rose-700">
                       <User className="w-4 h-4" /> Humanize Intensity
                    </label>
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{humanizeIntensity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={humanizeIntensity}
                    onChange={(e) => setHumanizeIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-rose-200 appearance-none cursor-pointer accent-rose-500 border border-black"
                  />
                  <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-rose-900/50">
                    <span>Academic (Strict)</span>
                    <span>Natural (Student)</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border-2 border-red-600 p-3 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-xs font-bold text-red-700">{error}</p>
                  </div>
                )}

                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`w-full py-4 ${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-black text-white hover:bg-rose-600'} border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-3`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" /> GENERATING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" /> GENERATE PAPER
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Info Box */}
            <div className="bg-white border-2 border-black p-4 flex gap-4 items-start shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-amber-100 p-2 border border-black">
                <Info className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase mb-1">How it works</h4>
                <p className="text-[10px] font-medium leading-relaxed text-gray-600">
                  Our Humanized Engine uses advanced linguistic patterns to inject natural sentence variation, student-level vocabulary transitions, and realistic logical flows that mimic human thought processes rather than linear AI outputs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!paper && !isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/50 border-4 border-dashed border-black/20 h-[600px] flex flex-col items-center justify-center text-center p-12"
                >
                  <BookOpen className="w-16 h-16 text-black/10 mb-4" />
                  <h3 className="text-xl font-black text-black/20 uppercase tracking-tighter">Paper Preview</h3>
                  <p className="text-black/20 font-bold max-w-xs mt-2">Generate a paper to see the professional draft here.</p>
                </motion.div>
              ) : isLoading ? (
                <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="bg-white border-4 border-black h-[600px] flex flex-col items-center justify-center p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
                >
                   <div className="relative">
                     <div className="w-24 h-24 border-8 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-8"></div>
                     <FileText className="w-8 h-8 text-rose-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   </div>
                   <h3 className="text-2xl font-black uppercase mb-2">Analyzing Topic...</h3>
                   <div className="space-y-2 w-full max-w-xs">
                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '100%' }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         className="h-full w-full bg-rose-500"
                       />
                     </div>
                     <p className="text-[10px] font-black uppercase text-gray-400 text-center tracking-[0.2em]">Crafting Human-like phrasing</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="paper"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] min-h-[800px] relative"
                >
                  {/* Download Floating Button */}
                  <div className="sticky top-20 flex justify-end -mt-8 mb-8 z-10">
                    <button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-emerald-400 border-2 border-black px-6 py-2 font-black text-xs uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> DOWNLOADING...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" /> Download DOCX
                        </>
                      )}
                    </button>
                  </div>

                  {/* Paper Content */}
                  <div className="max-w-2xl mx-auto prose prose-rose">
                    <div className="text-center mb-12">
                      <h1 className="text-3xl font-black text-black uppercase leading-tight mb-4">{paper?.title}</h1>
                      <div className="w-20 h-1 bg-black mx-auto" />
                    </div>

                    <div className="mb-8">
                      <h4 className="text-xs font-black uppercase text-rose-600 mb-2 tracking-widest border-b border-rose-100 pb-1">Abstract</h4>
                      <p className="text-sm font-medium leading-relaxed italic text-gray-700">{paper?.abstract}</p>
                    </div>

                    <div className={`space-y-8 ${paperFormat === 'ieee' ? 'columns-1 md:columns-2 gap-8 space-y-0 [&>section]:break-inside-avoid [&>section]:mb-8' : ''}`}>
                      <section>
                        <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                           <ChevronRight className="w-4 h-4 text-rose-500" /> 1. Introduction
                        </h4>
                        <div className="space-y-4">
                          {paper?.introduction.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                           <ChevronRight className="w-4 h-4 text-rose-500" /> 2. Literature Review
                        </h4>
                        <div className="space-y-4">
                          {paper?.literatureReview.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                           <ChevronRight className="w-4 h-4 text-rose-500" /> 3. Methodology
                        </h4>
                        <div className="space-y-4">
                          {paper?.methodology.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}

                          {/* Architecture Diagram */}
                          <div className="my-8" ref={diagramRef}>
                            <div className="bg-gray-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                              <svg width="400" height="200" viewBox="0 0 400 200" className="w-full h-auto max-w-md">
                                {/* Nodes */}
                                <rect x="20" y="70" width="80" height="60" fill="#fff" stroke="#000" strokeWidth="3" />
                                <text x="60" y="105" textAnchor="middle" className="text-[10px] font-black uppercase">Input</text>
                                
                                <rect x="160" y="40" width="100" height="120" fill="#fff" stroke="#e11d48" strokeWidth="3" strokeDasharray="5,5" />
                                <text x="210" y="105" textAnchor="middle" className="text-[10px] font-black uppercase fill-rose-600">Processing Engine</text>
                                
                                <rect x="300" y="70" width="80" height="60" fill="#fff" stroke="#000" strokeWidth="3" />
                                <text x="340" y="105" textAnchor="middle" className="text-[10px] font-black uppercase">Output</text>
                                
                                {/* Arrows */}
                                <path d="M100 100 L160 100" stroke="#000" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <path d="M260 100 L300 100" stroke="#000" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                
                                <defs>
                                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
                                  </marker>
                                </defs>
                              </svg>
                              <p className="text-[10px] font-black uppercase mt-4 text-center bg-white px-4 py-1 border border-black italic">Figure 2.0: Proposed System Architecture for {paper?.title}</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                         <div className="bg-rose-50 p-4 border-l-4 border-rose-500 my-6">
                            <p className="text-xs font-bold text-rose-800 italic flex items-start gap-2">
                               <Quote className="w-4 h-4 shrink-0" />
                               "The success of technology lies in its ability to amplify human potential rather than replace it."
                            </p>
                         </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                           <ChevronRight className="w-4 h-4 text-rose-500" /> 4. Results & Discussion
                        </h4>
                        <div className="space-y-4">
                          {paper?.results.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}

                          {/* Data Table */}
                          {paper?.tableData && (
                            <div className="my-8 border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-gray-100 border-b-2 border-black font-black uppercase tracking-tighter">
                                  <tr>
                                    {Object.keys(paper.tableData[0]).map((key) => (
                                      <th key={key} className="p-2 border-r-2 border-black last:border-r-0">{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="font-bold">
                                  {paper.tableData.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                      {Object.values(row).map((val, j) => (
                                        <td key={j} className="p-2 border-r-2 border-black last:border-r-0">{val}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <p className="text-[10px] font-black uppercase p-2 bg-black text-white text-center italic">Table 1.0: Comparative Analysis of Proposed Metrics</p>
                            </div>
                          )}

                          {/* Data Chart */}
                          {paper?.chartData && (
                            <div className="my-8" ref={chartRef}>
                              <div className="h-64 w-full border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={paper.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="name" stroke="#000" fontSize={10} fontWeight="bold" />
                                    <YAxis stroke="#000" fontSize={10} fontWeight="bold" />
                                    <Tooltip 
                                      contentStyle={{ backgroundColor: '#fff', border: '2px solid black', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#e11d48" fill="#fecdd3" strokeWidth={3} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                              <p className="text-[10px] font-black uppercase mt-2 text-center text-rose-600">Figure 1.0: Experimental Growth and Performance Scalability</p>
                            </div>
                          )}

                          {paper?.discussion.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
                           <ChevronRight className="w-4 h-4 text-rose-500" /> 5. Conclusion
                        </h4>
                        <div className="space-y-4">
                          {paper?.conclusion.split('\n').map((paragraph, idx) => (
                            paragraph.startsWith('###') ? (
                              <h5 key={idx} className="text-sm font-black uppercase mt-6 mb-2 text-gray-800">{paragraph.replace('###', '').trim()}</h5>
                            ) : (
                              <p key={idx} className="text-sm font-medium leading-relaxed">{paragraph}</p>
                            )
                          ))}
                        </div>
                      </section>

                      <section className="pt-8 border-t-2 border-black border-dashed">
                        <h4 className="text-xs font-black uppercase mb-4 tracking-[0.2em]">References</h4>
                        <ul className="space-y-2">
                          {paper?.references.map((ref, i) => (
                            <li key={i} className="text-[10px] font-bold text-gray-600 pl-4 border-l-2 border-gray-200">{ref}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-4 pb-12">
        <div className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Powered by StudHub Neural Engine</p>
          <div className="flex gap-4">
            <span className="text-[10px] font-black uppercase text-rose-500">Privacy Guaranteed</span>
            <span className="text-[10px] font-black uppercase text-gray-500">Academic Integrity First</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
