import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Spacing,
  SectionType,
  PageNumber,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} from 'docx';

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

export async function generateResearchPaperDocx(
  paper: ResearchPaper,
  format: string = 'apa',
  chartImage?: string,
  diagramImage?: string
): Promise<Buffer> {
  const isIEEE = format === 'ieee';

  const parseBase64Image = (base64: string) => {
    return Buffer.from(base64.split(',')[1], 'base64');
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: paper.title,
                bold: true,
                size: 32,
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
          }),

          // Abstract Section (Always Single Column)
          new Paragraph({
            children: [
              new TextRun({
                text: 'Abstract',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: paper.abstract,
                italics: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),
        ],
      },
      {
        properties: {
          column: {
            count: isIEEE ? 2 : 1,
            separate: false,
            space: 708, // Approx 0.5 inch
          },
        },
        children: [
          // Introduction
          new Paragraph({
            children: [new TextRun({ text: '1. Introduction', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.introduction.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // Literature Review
          new Paragraph({
            children: [new TextRun({ text: '2. Literature Review', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.literatureReview.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // Methodology
          new Paragraph({
            children: [new TextRun({ text: '3. Methodology', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.methodology.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // Diagram
          ...(diagramImage ? [
            new Paragraph({
              children: [
                new ImageRun({
                  data: parseBase64Image(diagramImage),
                  transformation: { width: 500, height: 250 },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 100 }
            })
          ] : [
            new Paragraph({
              children: [new TextRun({ text: '[INSERT FIGURE 2.0: Proposed System Architecture Diagram]', bold: true, size: 20, font: 'Times New Roman', color: '0000FF' })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 100 }
            })
          ]),
          new Paragraph({
            children: [new TextRun({ text: `Figure 2.0: Proposed System Architecture for ${paper.title}`, italics: true, size: 18, font: 'Times New Roman' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 300 }
          }),

          // Results
          new Paragraph({
            children: [new TextRun({ text: '4. Results', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.results.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // Results Table
          ...(paper.tableData && paper.tableData.length > 0 ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: Object.keys(paper.tableData[0]).map(key => 
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: key, bold: true, size: 20, font: 'Times New Roman' })],
                        alignment: AlignmentType.CENTER 
                      })],
                      shading: { fill: 'EEEEEE' }
                    })
                  )
                }),
                ...paper.tableData.map(row => 
                  new TableRow({
                    children: Object.values(row).map(val => 
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: String(val), size: 20, font: 'Times New Roman' })],
                          alignment: AlignmentType.CENTER 
                        })]
                      })
                    )
                  })
                )
              ]
            }),
            new Paragraph({
              children: [new TextRun({ text: 'Table 1.0: Experimental Data and Comparative Metrics', italics: true, size: 18, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 300 }
            })
          ] : []),

          // Chart
          ...(chartImage ? [
            new Paragraph({
              children: [
                new ImageRun({
                  data: parseBase64Image(chartImage),
                  transformation: { width: 500, height: 250 },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 100 }
            })
          ] : [
             new Paragraph({
              children: [new TextRun({ text: '[INSERT FIGURE 1.0: Performance Scalability Chart]', bold: true, size: 20, font: 'Times New Roman', color: 'FF0000' })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 100 }
            })
          ]),
          new Paragraph({
            children: [new TextRun({ text: 'Figure 1.0: Experimental Growth and Performance Scalability', italics: true, size: 18, font: 'Times New Roman' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 300 }
          }),

          // Discussion
          new Paragraph({
            children: [new TextRun({ text: '5. Discussion', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.discussion.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // Conclusion
          new Paragraph({
            children: [new TextRun({ text: '6. Conclusion', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          ...paper.conclusion.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 22, font: 'Times New Roman' })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            })
          ),

          // References
          new Paragraph({
            children: [new TextRun({ text: 'References', bold: true, size: 24, font: 'Times New Roman' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...paper.references.map((ref, index) => 
            new Paragraph({
              children: [new TextRun({ text: `[${index + 1}] ${ref}`, size: 20, font: 'Times New Roman' })],
              alignment: AlignmentType.LEFT,
              spacing: { after: 120 },
            })
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
