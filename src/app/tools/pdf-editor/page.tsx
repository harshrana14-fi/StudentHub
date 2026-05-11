'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Trash2, 
  RotateCw, 
  RotateCcw, 
  Plus, 
  Type, 
  Move,
  Upload,
  Layers,
  Save,
  X,
  Eraser,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  MousePointer2,
  Highlighter,
  PlusSquare,
  FilePlus,
  RefreshCcw,
  Bold,
  Italic,
  Highlighter as HighlighterIcon,
  Undo2,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import dynamic from 'next/dynamic';

// Core CSS
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { motion, AnimatePresence } from 'framer-motion';

import { Document, Page, pdfjs } from 'react-pdf';

// No global worker set here to avoid SSR issues


interface Annotation {
  id: string;
  type: 'text' | 'whiteout' | 'highlight' | 'image';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  fontSize: number;
  fontFamily: 'Helvetica' | 'Times-Roman' | 'Courier';
  color: { r: number, g: number, b: number };
  isBold?: boolean;
  isItalic?: boolean;
  opacity?: number;
  imageBytes?: Uint8Array;
  imageType?: 'png' | 'jpg';
}

interface PDFPageData {
  id: string;
  originalPageIndex: number;
  sourceFileIndex: number; 
  rotation: number;
  isDeleted: boolean;
}

const MemoizedPage = React.memo(({ pageNumber, width, onRenderSuccess }: { pageNumber: number, width: number, onRenderSuccess?: () => void }) => (
  <Page 
    pageNumber={pageNumber} 
    width={width} 
    renderTextLayer={true}
    renderAnnotationLayer={true}
    onRenderSuccess={onRenderSuccess}
  />
), (prev, next) => prev.pageNumber === next.pageNumber && prev.width === next.width);

const MemoizedDocument = React.memo(({ file, pageWidth, pageNumber }: { file: any, pageWidth: number, pageNumber: number }) => (
  <Document
    file={file}
    options={{
      workerSrc: '/pdf.worker.min.js',
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }}
    loading={
      <div className="flex items-center justify-center bg-gray-50 border-2 border-black border-dashed" style={{ width: pageWidth, height: pageWidth * 1.41 }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-indigo-500 animate-spin"></div>
          <span className="font-bold uppercase text-sm">Rendering Page...</span>
        </div>
      </div>
    }
  >
    <MemoizedPage pageNumber={pageNumber} width={pageWidth} />
  </Document>
), (prev, next) => prev.file === next.file && prev.pageWidth === next.pageWidth && prev.pageNumber === next.pageNumber);


interface SourceFile {
  name: string;
  bytes: Uint8Array;
  url: string;
  file: File;
}

export default function PDFEditorPage() {
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [pages, setPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('single');
  const [pageWidth, setPageWidth] = useState(600);

  
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'whiteout' | 'highlight' | 'image'>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendInputRef = useRef<HTMLInputElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [guideLines, setGuideLines] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });

  useEffect(() => {
    setIsClient(true);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    if (!mainContainerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        // Padding and border adjustments
        const availableWidth = width - 40; 
        setPageWidth(Math.min(availableWidth, 600));
      }
    });

    resizeObserver.observe(mainContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);


  // Removed previous responsive useEffect as we use ResizeObserver now
  
  // Safety check for current page data
  const currentPageData = pages[currentPage - 1];
  const currentSourceFile = currentPageData ? sourceFiles[currentPageData.sourceFileIndex] : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, append = false) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setIsLoading(true);
      setError(null);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        // Use a slice to avoid detaching the buffer if pdf-lib tries to take ownership
        const doc = await PDFDocument.load(uint8Array.slice());
        const count = doc.getPageCount();

        const newSourceFile: SourceFile = {
          name: selectedFile.name,
          bytes: uint8Array,
          url: URL.createObjectURL(selectedFile),
          file: selectedFile
        };

        if (append) {
          const newSourceIndex = sourceFiles.length;
          setSourceFiles(prev => [...prev, newSourceFile]);
          
          const newPages: PDFPageData[] = Array.from({ length: count }, (_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            originalPageIndex: i,
            sourceFileIndex: newSourceIndex,
            rotation: 0,
            isDeleted: false,
          }));
          
          setPages(prev => [...prev, ...newPages]);
        } else {
          setSourceFiles([newSourceFile]);
          const initialPages: PDFPageData[] = Array.from({ length: count }, (_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            originalPageIndex: i,
            sourceFileIndex: 0,
            rotation: 0,
            isDeleted: false,
          }));
          setPages(initialPages);
          setAnnotations([]);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load PDF. The file might be corrupted or encrypted.');
      } finally {
        setIsLoading(false);
      }
    } else if (selectedFile) {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleRotate = (index: number, direction: 'cw' | 'ccw') => {
    setPages(prev => prev.map((p, i) => {
      if (i === index) {
        const newRotation = direction === 'cw' 
          ? (p.rotation + 90) % 360 
          : (p.rotation - 90 + 360) % 360;
        return { ...p, rotation: newRotation };
      }
      return p;
    }));
  };

  const handleDelete = (index: number) => {
    setPages(prev => prev.map((p, i) => {
      if (i === index) return { ...p, isDeleted: !p.isDeleted };
      return p;
    }));
  };

  const handlePageClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      setSelectedAnnotationId(null);
      return;
    }
    
    if (pageContainerRef.current) {
      const rect = pageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (activeTool === 'text' || activeTool === 'whiteout' || activeTool === 'highlight') {
        const newAnnotation: Annotation = {
          id: Math.random().toString(36).substr(2, 9),
          type: activeTool,
          text: activeTool === 'text' ? 'Type something...' : '',
          x,
          y,
          width: (activeTool === 'whiteout' || activeTool === 'highlight') ? 100 : 0,
          height: (activeTool === 'whiteout' || activeTool === 'highlight') ? 30 : 0,
          pageIndex: currentPage - 1,
          fontSize: 16,
          fontFamily: 'Helvetica',
          color: activeTool === 'text' ? { r: 0, g: 0, b: 0 } : 
                 activeTool === 'highlight' ? { r: 255, g: 255, b: 0 } : { r: 255, g: 255, b: 255 },
          isBold: false,
          isItalic: false,
          opacity: activeTool === 'highlight' ? 0.4 : 1
        };
        
        saveHistory();
        setAnnotations(prev => [...prev, newAnnotation]);
        if (activeTool === 'text') {
          setEditingTextId(newAnnotation.id);
        }
        setSelectedAnnotationId(newAnnotation.id);
        setActiveTool('select');
      } else if (activeTool === 'image') {
        imageInputRef.current?.click();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const newWidth = Math.min(200, img.width);
        const newHeight = newWidth / aspectRatio;
        
        const newAnnotation: Annotation = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          text: '',
          x: 50, // Default position
          y: 50,
          width: newWidth,
          height: newHeight,
          pageIndex: currentPage - 1,
          fontSize: 0,
          fontFamily: 'Helvetica',
          color: { r: 0, g: 0, b: 0 },
          imageBytes: bytes,
          imageType: file.type === 'image/png' ? 'png' : 'jpg'
        };
        
        saveHistory();
        setAnnotations(prev => [...prev, newAnnotation]);
        setSelectedAnnotationId(newAnnotation.id);
        setActiveTool('select');
      };
    }
  };

  const saveHistory = () => {
    setHistory(prev => [...prev, [...annotations]].slice(-20));
  };

  const undo = () => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setAnnotations(last);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const updateAnnotationText = (id: string, text: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, text } : a));
  };

  const deleteAnnotation = (id: string) => {
    saveHistory();
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setSelectedAnnotationId(null);
  };

  const handleDownload = async () => {
    if (sourceFiles.length === 0) return;
    
    setIsLoading(true);
    try {
      const newDoc = await PDFDocument.create();
      
      // Embed standard fonts and their variants
      const fonts: any = {
        'Helvetica': {
          regular: await newDoc.embedFont(StandardFonts.Helvetica),
          bold: await newDoc.embedFont(StandardFonts.HelveticaBold),
          italic: await newDoc.embedFont(StandardFonts.HelveticaOblique),
          boldItalic: await newDoc.embedFont(StandardFonts.HelveticaBoldOblique),
        },
        'Times-Roman': {
          regular: await newDoc.embedFont(StandardFonts.TimesRoman),
          bold: await newDoc.embedFont(StandardFonts.TimesRomanBold),
          italic: await newDoc.embedFont(StandardFonts.TimesRomanItalic),
          boldItalic: await newDoc.embedFont(StandardFonts.TimesRomanBoldItalic),
        },
        'Courier': {
          regular: await newDoc.embedFont(StandardFonts.Courier),
          bold: await newDoc.embedFont(StandardFonts.CourierBold),
          italic: await newDoc.embedFont(StandardFonts.CourierOblique),
          boldItalic: await newDoc.embedFont(StandardFonts.CourierBoldOblique),
        },
      };
      
      const loadedDocs = await Promise.all(
        sourceFiles.map(f => PDFDocument.load(f.bytes.slice()))
      );
      
      for (const [newIdx, pageData] of pages.entries()) {
        if (!pageData.isDeleted) {
          const sourceDoc = loadedDocs[pageData.sourceFileIndex];
          const originalPage = sourceDoc.getPage(pageData.originalPageIndex);
          const originalRotation = originalPage.getRotation().angle || 0;
          
          const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageData.originalPageIndex]);
          copiedPage.setRotation(degrees((originalRotation + pageData.rotation) % 360));
          
          const pageAnnotations = annotations.filter(a => a.pageIndex === newIdx);
          const cropBox = copiedPage.getCropBox();
          const { width, height, x: cropX, y: cropY } = cropBox;
          
          const isLandscape = originalRotation === 90 || originalRotation === 270;
          const visualWidth = isLandscape ? height : width;
          const visualHeight = isLandscape ? width : height;
          const scale = visualWidth / pageWidth;
          
          // Sort annotations: whiteout first, then highlight, then image, then text
          const sortedAnnotations = [...pageAnnotations].sort((a, b) => {
            const order = { 'whiteout': 1, 'highlight': 2, 'image': 3, 'text': 4 };
            return (order[a.type] || 99) - (order[b.type] || 99);
          });

          for (const ann of sortedAnnotations) {
            const vX = ann.x * scale;
            const vY = ann.y * scale;
            const vWidth = ann.width * scale;
            const vHeight = ann.height * scale;
            
            let pdfX, pdfY;
            if (originalRotation === 0) {
              pdfX = cropX + vX;
              pdfY = cropY + height - vY;
            } else if (originalRotation === 90) {
              pdfX = cropX + vY;
              pdfY = cropY + vX;
            } else if (originalRotation === 180) {
              pdfX = cropX + width - vX;
              pdfY = cropY + vY;
            } else if (originalRotation === 270) {
              pdfX = cropX + width - vY;
              pdfY = cropY + height - vX;
            } else {
              pdfX = cropX + vX;
              pdfY = cropY + height - vY;
            }
            
            if (ann.type === 'text') {
              const scaledFontSize = ann.fontSize * scale;
              
              // Select font variant
              let fontToUse;
              const fontGroup = fonts[ann.fontFamily] || fonts['Helvetica'];
              if (ann.isBold && ann.isItalic) fontToUse = fontGroup.boldItalic;
              else if (ann.isBold) fontToUse = fontGroup.bold;
              else if (ann.isItalic) fontToUse = fontGroup.italic;
              else fontToUse = fontGroup.regular;

              // Adjust for baseline depending on rotation
              let textX = pdfX;
              let textY = pdfY;
              
              // More precise baseline adjustment
              const ascent = fontToUse.heightAtSize(scaledFontSize);
              
              if (originalRotation === 0) {
                textY -= ascent;
              } else if (originalRotation === 90) {
                textX += ascent;
              } else if (originalRotation === 180) {
                textY += ascent;
              } else if (originalRotation === 270) {
                textX -= ascent;
              }

              copiedPage.drawText(ann.text, {
                x: textX,
                y: textY,
                size: scaledFontSize,
                font: fontToUse,
                color: rgb(ann.color.r / 255, ann.color.g / 255, ann.color.b / 255),
                lineHeight: scaledFontSize * 1.2,
                rotate: degrees(-originalRotation),
              });
            } else if (ann.type === 'whiteout' || ann.type === 'highlight') {
              let rectX = pdfX;
              let rectY = pdfY;
              let rW = vWidth;
              let rH = vHeight;
              
              if (originalRotation === 0) {
                rectY -= vHeight;
              } else if (originalRotation === 90) {
                rW = vHeight;
                rH = vWidth;
              } else if (originalRotation === 180) {
                rectX -= vWidth;
              } else if (originalRotation === 270) {
                rectX -= vHeight;
                rectY -= vWidth;
                rW = vHeight;
                rH = vWidth;
              }

              copiedPage.drawRectangle({
                x: rectX,
                y: rectY,
                width: rW,
                height: rH,
                color: rgb(ann.color.r / 255, ann.color.g / 255, ann.color.b / 255),
                opacity: ann.opacity ?? 1,
              });
            } else if (ann.type === 'image' && ann.imageBytes) {
              const img = ann.imageType === 'png' 
                ? await newDoc.embedPng(ann.imageBytes.slice())
                : await newDoc.embedJpg(ann.imageBytes.slice());
              
              let rectX = pdfX;
              let rectY = pdfY;
              let rW = vWidth;
              let rH = vHeight;
              
              if (originalRotation === 0) {
                rectY -= vHeight;
              } else if (originalRotation === 90) {
                rW = vHeight;
                rH = vWidth;
              } else if (originalRotation === 180) {
                rectX -= vWidth;
              } else if (originalRotation === 270) {
                rectX -= vHeight;
                rectY -= vWidth;
                rW = vHeight;
                rH = vWidth;
              }

              copiedPage.drawImage(img, {
                x: rectX,
                y: rectY,
                width: rW,
                height: rH,
                rotate: degrees(-originalRotation),
              });
            }
          }
          
          newDoc.addPage(copiedPage);
        }
      }
      
      const modifiedPdfBytes = await newDoc.save();
      const blob = new Blob([modifiedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to save PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const activePages = pages.filter(p => !p.isDeleted);

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col font-sans border-b-4 border-black">
      <header className="bg-white border-b-4 border-black p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 text-black">
          <Link
            href="/tools"
            className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-400 p-2 border-2 border-black">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter">PDF Editor Pro</h1>
            <div className="ml-4 px-2 py-1 bg-emerald-100 border border-emerald-500 text-emerald-700 text-[10px] font-black rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> PIXEL-PERFECT RENDERING ENABLED
            </div>
          </div>
        </div>

        {sourceFiles.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => appendInputRef.current?.click()}
              className="px-4 py-2 bg-amber-200 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black"
            >
              <FilePlus className="w-4 h-4" /> Merge PDF
            </button>
            <input 
              type="file" 
              className="hidden" 
              ref={appendInputRef} 
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, true)}
            />
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
              className={`px-4 py-2 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-indigo-300' : 'bg-white'} text-black`}
            >
              {viewMode === 'grid' ? <Layers className="w-4 h-4" /> : <Move className="w-4 h-4" />}
              {viewMode === 'grid' ? 'Grid View' : 'Focus View'}
            </button>
            
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-400 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {sourceFiles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 md:p-24">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl w-full bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center"
            >
              <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black">
                <Upload className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-black mb-4 uppercase text-black">Upload your PDF</h2>
              <p className="text-xl font-bold text-gray-600 mb-8">
                Edit, rotate, merge and annotate your PDF documents with our pro student tools.
              </p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-black p-12 cursor-pointer hover:bg-gray-50 transition-colors relative group"
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e)}
                />
                <Plus className="w-12 h-12 mx-auto mb-4 group-hover:rotate-90 transition-transform duration-300 text-black" />
                <p className="text-2xl font-black uppercase text-black">Drop PDF here or click to browse</p>
                <p className="text-sm font-bold mt-2 text-gray-500 uppercase">Secure & Local Processing</p>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-200 border-2 border-black font-bold text-red-700">
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row items-start">
            <div className="w-full md:w-20 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-row md:flex-col items-center justify-start py-4 gap-4 overflow-x-auto md:overflow-visible scrollbar-hide z-40 sticky top-[80px] h-fit md:min-h-[400px]">
              <div className="flex flex-row md:flex-col gap-3 w-full items-center px-2">
                <ToolButton 
                  icon={MousePointer2} 
                  active={activeTool === 'select'} 
                  onClick={() => setActiveTool('select')}
                  label="Select"
                  shortcut="V"
                />
                <ToolButton 
                  icon={Type} 
                  active={activeTool === 'text'} 
                  onClick={() => setActiveTool('text')}
                  label="Text"
                  shortcut="T"
                />
                <ToolButton 
                  icon={HighlighterIcon} 
                  active={activeTool === 'highlight'} 
                  onClick={() => setActiveTool('highlight')}
                  label="Highlight"
                  shortcut="H"
                />
                <ToolButton 
                  icon={Eraser} 
                  active={activeTool === 'whiteout'} 
                  onClick={() => setActiveTool('whiteout')}
                  label="Whiteout"
                  shortcut="E"
                />
                
                <div className="hidden md:block w-10 h-[2px] bg-black my-2" />
                
                <ToolButton 
                  icon={ImageIcon} 
                  active={activeTool === 'image'} 
                  onClick={() => setActiveTool('image')}
                  label="Image"
                  shortcut="I"
                />
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                />

                <div className="hidden md:block w-10 h-[2px] bg-black my-2" />

                <ToolButton 
                  icon={Undo2} 
                  onClick={undo}
                  label="Undo"
                  shortcut="Z"
                />
                <ToolButton 
                  icon={RotateCw} 
                  onClick={() => handleRotate(currentPage - 1, 'cw')}
                  label="Rotate"
                  shortcut="R"
                />
                <ToolButton 
                  icon={Trash2} 
                  onClick={() => handleDelete(currentPage - 1)}
                  label="Delete"
                  shortcut="DEL"
                />
              </div>

              <div className="hidden md:flex flex-col gap-4 items-center pt-4 w-full border-t-2 border-gray-100">
                <ToolButton 
                  icon={RefreshCcw} 
                  onClick={() => {
                    if (confirm('Clear all annotations and files?')) {
                      setSourceFiles([]);
                      setPages([]);
                      setAnnotations([]);
                      setHistory([]);
                    }
                  }}
                  label="Reset"
                />
              </div>
            </div>

            <div 
              ref={mainContainerRef}
              className="flex-1 bg-[#e0e0e0] overflow-visible p-4 md:p-8 relative scrollbar-hide"
            >
              {viewMode === 'single' ? (
                <div className="max-w-4xl mx-auto flex flex-col items-center pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none transition-all text-black"
                    >
                      <ChevronLeft />
                    </button>
                    <div className="bg-white px-4 py-2 border-2 border-black font-black text-black">
                      PAGE {currentPage} OF {pages.length}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(pages.length, p + 1))}
                      disabled={currentPage === pages.length}
                      className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none transition-all text-black"
                    >
                      <ChevronRight />
                    </button>
                  </div>

                  <div 
                    ref={pageContainerRef}
                    className={`bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-0 relative cursor-${activeTool === 'text' ? 'crosshair' : 'default'}`}
                    onClick={handlePageClick}
                  >
                    <AnimatePresence mode="wait">
                      {currentPageData && currentSourceFile && (
                        <motion.div
                          key={currentPage}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          style={{ rotate: currentPageData.rotation }}
                          className="relative"
                        >
                          {isClient && (
                            <MemoizedDocument 
                              file={currentSourceFile.url} 
                              pageWidth={pageWidth} 
                              pageNumber={currentPageData.originalPageIndex + 1} 
                            />
                          )}

                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {/* Alignment Guide Lines */}
                            {guideLines.x !== null && (
                              <div 
                                className="absolute top-0 bottom-0 border-l-2 border-indigo-500/50 z-[200]"
                                style={{ left: guideLines.x }}
                              >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[8px] px-1 font-black rounded-b">CENTER</div>
                              </div>
                            )}
                            {guideLines.y !== null && (
                              <div 
                                className="absolute left-0 right-0 border-t-2 border-indigo-500/50 z-[200]"
                                style={{ top: guideLines.y }}
                              >
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[8px] px-1 font-black rounded-r rotate-90 origin-left">CENTER</div>
                              </div>
                            )}

                            {annotations
                              .filter(a => a.pageIndex === currentPage - 1)
                              .map(ann => (
                                <motion.div
                                  key={ann.id}
                                  onMouseDown={(e) => {
                                    if (activeTool !== 'select' || editingTextId === ann.id) return;
                                    e.stopPropagation();
                                    setSelectedAnnotationId(ann.id);
                                    
                                    const rect = pageContainerRef.current?.getBoundingClientRect();
                                    if (!rect) return;

                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const initialX = ann.x;
                                    const initialY = ann.y;

                                    const el = e.currentTarget as HTMLElement;
                                    const elWidth = el.offsetWidth;
                                    const elHeight = el.offsetHeight;

                                    const onMouseMove = (moveEvent: MouseEvent) => {
                                      const deltaX = moveEvent.clientX - startX;
                                      const deltaY = moveEvent.clientY - startY;
                                      
                                      let newX = initialX + deltaX;
                                      let newY = initialY + deltaY;

                                      // Alignment Snapping
                                      const threshold = 6;
                                      const centerX = rect.width / 2;
                                      const centerY = rect.height / 2;
                                      
                                      const elCenterX = newX + elWidth / 2;
                                      const elCenterY = newY + elHeight / 2;

                                      let showLineX = null;
                                      let showLineY = null;

                                      if (Math.abs(elCenterX - centerX) < threshold) {
                                        newX = centerX - elWidth / 2;
                                        showLineX = centerX;
                                      }
                                      if (Math.abs(elCenterY - centerY) < threshold) {
                                        newY = centerY - elHeight / 2;
                                        showLineY = centerY;
                                      }
                                      setGuideLines({ x: showLineX, y: showLineY });

                                      // Constraint checks
                                      newX = Math.max(0, Math.min(newX, rect.width - elWidth));
                                      newY = Math.max(0, Math.min(newY, rect.height - elHeight));

                                      setAnnotations(prev => prev.map(a => 
                                        a.id === ann.id ? { ...a, x: newX, y: newY } : a
                                      ));
                                    };

                                    const onMouseUp = () => {
                                       setGuideLines({ x: null, y: null });
                                      window.removeEventListener('mousemove', onMouseMove);
                                      window.removeEventListener('mouseup', onMouseUp);
                                    };

                                    window.addEventListener('mousemove', onMouseMove);
                                    window.addEventListener('mouseup', onMouseUp);
                                  }}
                                  style={{ 
                                    left: ann.x, 
                                    top: ann.y, 
                                    width: (ann.type === 'image' || ann.type === 'whiteout' || ann.type === 'highlight') ? ann.width : 'auto',
                                    height: (ann.type === 'image' || ann.type === 'whiteout' || ann.type === 'highlight') ? ann.height : 'auto',
                                    position: 'absolute',
                                    pointerEvents: activeTool === 'select' ? 'auto' : 'none',
                                    zIndex: selectedAnnotationId === ann.id ? 100 : (ann.type === 'text' ? 20 : 10)
                                  }}
                                  className={`group cursor-move absolute ${ann.type === 'whiteout' ? '' : 'p-2'} border-2 ${selectedAnnotationId === ann.id ? 'border-indigo-500 bg-indigo-50/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent ' + (ann.type === 'whiteout' ? 'hover:border-indigo-300/50 hover:border-dashed' : 'hover:border-gray-300')} transition-all`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAnnotationId(ann.id);
                                  }}
                                >
                                    {ann.type === 'image' ? (
                                      <div 
                                        className="w-full h-full relative group overflow-hidden"
                                        style={{ 
                                          border: selectedAnnotationId === ann.id ? '2px solid black' : 'none'
                                        }}
                                      >
                                        <img 
                                          src={ann.imageBytes ? URL.createObjectURL(new Blob([ann.imageBytes as any])) : ''} 
                                          className="w-full h-full object-contain pointer-events-none"
                                          alt="Annotation"
                                          onLoad={(e) => {
                                            // Optional: Revoke URL after load if needed, but since it's a blob it's fine for now
                                          }}
                                        />
                                        {selectedAnnotationId === ann.id && (
                                          <div 
                                            className="absolute bottom-0 right-0 w-4 h-4 bg-black cursor-se-resize flex items-center justify-center"
                                            onMouseDown={(e) => {
                                              e.stopPropagation();
                                              const startX = e.clientX;
                                              const startY = e.clientY;
                                              const startWidth = ann.width;
                                              const startHeight = ann.height;
                                              const aspectRatio = startWidth / startHeight;
                                              
                                              const onMouseMove = (moveEvent: MouseEvent) => {
                                                const newWidth = Math.max(20, startWidth + (moveEvent.clientX - startX));
                                                const newHeight = newWidth / aspectRatio;
                                                setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, width: newWidth, height: newHeight } : a));
                                              };
                                              
                                              const onMouseUp = () => {
                                       setGuideLines({ x: null, y: null });
                                                window.removeEventListener('mousemove', onMouseMove);
                                                window.removeEventListener('mouseup', onMouseUp);
                                              };
                                              
                                              window.addEventListener('mousemove', onMouseMove);
                                              window.addEventListener('mouseup', onMouseUp);
                                            }}
                                          >
                                            <div className="w-2 h-2 bg-white rotate-45" />
                                          </div>
                                        )}
                                      </div>
                                    ) : ann.type === 'whiteout' || ann.type === 'highlight' ? (
                                      <div 
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          backgroundColor: ann.type === 'highlight' ? `rgba(${ann.color.r},${ann.color.g},${ann.color.b},${ann.opacity || 0.4})` : 'white',
                                          border: selectedAnnotationId === ann.id ? '2px solid black' : 'none'
                                        }}
                                        className="relative group transition-all"
                                      >
                                      {selectedAnnotationId === ann.id && (
                                        <>
                                          <div 
                                            className="absolute bottom-0 right-0 w-3 h-3 bg-black cursor-se-resize"
                                            onMouseDown={(e) => {
                                              e.stopPropagation();
                                              const startX = e.clientX;
                                              const startY = e.clientY;
                                              const startWidth = ann.width;
                                              const startHeight = ann.height;
                                              
                                              const onMouseMove = (moveEvent: MouseEvent) => {
                                                const newWidth = Math.max(10, startWidth + (moveEvent.clientX - startX));
                                                const newHeight = Math.max(10, startHeight + (moveEvent.clientY - startY));
                                                setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, width: newWidth, height: newHeight } : a));
                                              };
                                              
                                              const onMouseUp = () => {
                                       setGuideLines({ x: null, y: null });
                                                window.removeEventListener('mousemove', onMouseMove);
                                                window.removeEventListener('mouseup', onMouseUp);
                                              };
                                              
                                              window.addEventListener('mousemove', onMouseMove);
                                              window.addEventListener('mouseup', onMouseUp);
                                            }}
                                          />
                                        </>
                                      )}
                                    </div>
                                  ) : editingTextId === ann.id ? (
                                    <textarea
                                      autoFocus
                                      value={ann.text}
                                      onChange={(e) => updateAnnotationText(ann.id, e.target.value)}
                                      onFocus={(e) => e.target.select()}
                                      onBlur={() => setEditingTextId(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          setEditingTextId(null);
                                        }
                                      }}
                                      className="bg-transparent border-none outline-none font-bold text-black resize-none overflow-hidden min-w-[150px]"
                                      style={{ 
                                        fontSize: `${ann.fontSize}px`, 
                                        color: `rgb(${ann.color.r},${ann.color.g},${ann.color.b})`,
                                        fontFamily: ann.fontFamily === 'Helvetica' ? 'Inter, sans-serif' : ann.fontFamily === 'Times-Roman' ? 'serif' : 'monospace',
                                        lineHeight: 1.2
                                      }}
                                      rows={ann.text.split('\n').length}
                                    />
                                  ) : (
                                    <div 
                                      onDoubleClick={() => setEditingTextId(ann.id)}
                                      className="whitespace-pre-wrap select-none"
                                      style={{ 
                                        fontSize: `${ann.fontSize}px`, 
                                        color: `rgb(${ann.color.r},${ann.color.g},${ann.color.b})`,
                                        fontFamily: ann.fontFamily === 'Helvetica' ? 'Inter, sans-serif' : ann.fontFamily === 'Times-Roman' ? 'serif' : 'monospace',
                                        fontWeight: ann.isBold ? '900' : 'bold',
                                        fontStyle: ann.isItalic ? 'italic' : 'normal',
                                        lineHeight: 1.2
                                      }}
                                    >
                                      {ann.text}
                                    </div>
                                  )}
                                  
                                  {selectedAnnotationId === ann.id && (
                                    <div className="absolute -top-12 -left-2 flex bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 gap-1 z-50 overflow-x-auto max-w-[90vw]">
                                      {ann.type === 'text' && (
                                        <>
                                          <select 
                                            value={ann.fontFamily}
                                            onChange={(e) => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, fontFamily: e.target.value as any } : a))}
                                            className="bg-white border-none outline-none font-bold text-xs px-1 cursor-pointer hover:bg-gray-100"
                                          >
                                            <option value="Helvetica">Sans</option>
                                            <option value="Times-Roman">Serif</option>
                                            <option value="Courier">Mono</option>
                                          </select>
                                          <div className="w-px bg-gray-300 my-1 mx-1"></div>
                                          <button onClick={() => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, fontSize: Math.max(8, a.fontSize - 2) } : a))} className="p-1 hover:bg-gray-200 font-bold">-</button>
                                          <span className="p-1 font-bold">{ann.fontSize}</span>
                                          <button onClick={() => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, fontSize: Math.min(72, a.fontSize + 2) } : a))} className="p-1 hover:bg-gray-200 font-bold">+</button>
                                          <div className="w-px bg-gray-300 my-1 mx-1"></div>
                                          <button 
                                            onClick={() => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, isBold: !a.isBold } : a))} 
                                            className={`p-1 w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-black transition-all ${ann.isBold ? 'bg-black text-white' : 'bg-white text-black'}`}
                                          >
                                            <Bold className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, isItalic: !a.isItalic } : a))} 
                                            className={`p-1 w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-black transition-all ${ann.isItalic ? 'bg-black text-white' : 'bg-white text-black'}`}
                                          >
                                            <Italic className="w-4 h-4" />
                                          </button>
                                          <div className="w-px bg-gray-300 my-1 mx-1"></div>
                                          <div className="flex flex-col">
                                            <input 
                                              type="color" 
                                              value={`#${((1 << 24) + (ann.color.r << 16) + (ann.color.g << 8) + ann.color.b).toString(16).slice(1)}`}
                                              onChange={(e) => {
                                                const hex = e.target.value;
                                                const r = parseInt(hex.slice(1, 3), 16);
                                                const g = parseInt(hex.slice(3, 5), 16);
                                                const b = parseInt(hex.slice(5, 7), 16);
                                                setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, color: { r, g, b } } : a));
                                              }}
                                              className="w-8 h-8 p-0 border-2 border-black cursor-pointer"
                                            />
                                          </div>
                                          <div className="w-px bg-gray-300 my-1 mx-1"></div>
                                        </>
                                      )}
                                      
                                      {(ann.type === 'highlight' || ann.type === 'whiteout') && (
                                        <>
                                          <div className="flex items-center gap-2 px-2">
                                            <span className="text-[10px] font-black uppercase">Alpha</span>
                                            <input 
                                              type="range" 
                                              min="0" max="1" step="0.1" 
                                              value={ann.opacity ?? 1}
                                              onChange={(e) => setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, opacity: parseFloat(e.target.value) } : a))}
                                              className="w-16 accent-black"
                                            />
                                          </div>
                                          {ann.type === 'highlight' && (
                                            <input 
                                              type="color" 
                                              value={`#${((1 << 24) + (ann.color.r << 16) + (ann.color.g << 8) + ann.color.b).toString(16).slice(1)}`}
                                              onChange={(e) => {
                                                const hex = e.target.value;
                                                const r = parseInt(hex.slice(1, 3), 16);
                                                const g = parseInt(hex.slice(3, 5), 16);
                                                const b = parseInt(hex.slice(5, 7), 16);
                                                setAnnotations(prev => prev.map(a => a.id === ann.id ? { ...a, color: { r, g, b } } : a));
                                              }}
                                              className="w-8 h-8 p-0 border-2 border-black cursor-pointer"
                                            />
                                          )}
                                          <div className="w-px bg-gray-300 my-1 mx-1"></div>
                                        </>
                                      )}
                                      {ann.type === 'image' && (
                                        <div className="flex items-center gap-2 px-2">
                                           <span className="text-[10px] font-black uppercase">Img</span>
                                           <ImageIcon className="w-4 h-4" />
                                        </div>
                                      )}
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); deleteAnnotation(ann.id); }}
                                        className="p-1 px-2 text-white bg-red-500 hover:bg-red-600 font-bold flex items-center gap-1 text-xs"
                                      >
                                        <Trash2 className="w-3 h-3" /> DELETE
                                      </button>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {currentPageData?.isDeleted && (
                      <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-red-600 text-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-4xl uppercase -rotate-12">
                          PAGE DELETED
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-20">
                  {pages.map((page, idx) => (
                    <motion.div 
                      key={page.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${page.isDeleted ? 'opacity-50' : ''}`}
                      onClick={() => {
                        setCurrentPage(idx + 1);
                        setViewMode('single');
                      }}
                    >
                      <div style={{ rotate: `${page.rotation}deg` }} className="overflow-hidden bg-gray-50 h-[200px] flex items-center justify-center">
                        {isClient && (
                          <Document 
                            file={sourceFiles[page.sourceFileIndex].url}
                            options={{ workerSrc: '/pdf.worker.min.js' }}
                          >
                            <Page 
                              pageNumber={page.originalPageIndex + 1} 
                              width={150} 
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-black">
                        {idx + 1}
                      </div>
                      
                      {page.isDeleted && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 pointer-events-none">
                           <Trash2 className="w-12 h-12 text-red-600 opacity-50" />
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRotate(idx, 'cw'); }}
                          className="p-1 bg-white border-2 border-black hover:bg-amber-300 text-black"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
                          className={`p-1 border-2 border-black ${page.isDeleted ? 'bg-red-400' : 'bg-white hover:bg-red-400'} text-black`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            

          </div>
        )}
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-8 border-indigo-400 border-t-black animate-spin"></div>
            <p className="text-2xl font-black uppercase text-black">Processing PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolButton({ icon: Icon, active, onClick, label, shortcut }: { icon: any, active?: boolean, onClick: () => void, label: string, shortcut?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-12 h-12 flex items-center justify-center transition-all border-2 border-black ${
        active 
          ? 'bg-indigo-400 translate-x-[2px] translate-y-[2px] shadow-none' 
          : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
      }`}
    >
      <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-black'}`} />
      
      <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100] border border-white/20">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest">{label}</span>
          {shortcut && (
            <span className="text-gray-400 font-mono">[{shortcut}]</span>
          )}
        </div>
      </div>
    </button>
  );
}
