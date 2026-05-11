declare module 'tesseract.js' {
  interface OCRResult {
    data: {
      text: string;
      words: Array<{
        text: string;
        confidence: number;
        bbox: { x0: number; y0: number; x1: number; y1: number };
      }>;
      lines: Array<{
        text: string;
        confidence: number;
        bbox: { x0: number; y0: number; x1: number; y1: number };
      }>;
    };
  }

  interface LoggerMessage {
    status: string;
    progress: number;
  }

  export function createWorker(options?: any): Promise<{
    load: (lang: string) => Promise<void>;
    recognize: (image: string | Blob) => Promise<OCRResult>;
    terminate: () => Promise<void>;
  }>;

  export function recognize(
    image: string | Blob,
    lang: string | string[],
    options?: any,
    logger?: (msg: LoggerMessage) => void
  ): Promise<OCRResult>;
}
