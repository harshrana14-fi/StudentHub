import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Spacing,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TableBorders,
  ImageRun,
  Media,
} from 'docx';
import { LabRecord } from '@/types';

export async function generateDocx(
  labRecord: LabRecord,
  experimentTitle: string,
  graphImageBuffer?: Buffer,
  visualOutputImageBuffer?: Buffer
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: experimentTitle,
                bold: true,
                size: 36,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Aim Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Aim',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: labRecord.aim,
                size: 24,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Theory Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Theory',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          ...labRecord.theory.split('\n').map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24,
                    font: 'Calibri',
                  }),
                ],
                spacing: { after: 120 },
              })
          ),

          // Algorithm Section (only if algorithm steps exist)
          ...(labRecord.algorithm && labRecord.algorithm.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Algorithm',
                      bold: true,
                      size: 28,
                      font: 'Calibri',
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 200 },
                }),
                ...labRecord.algorithm.map(
                  (step, index) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${index + 1}. ${step}`,
                          size: 24,
                          font: 'Calibri',
                        }),
                      ],
                      spacing: { after: 120 },
                    })
                ),
              ]
            : []),

          // Code Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Code',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          ...labRecord.code.split('\n').map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 20,
                    font: 'Courier New',
                  }),
                ],
                spacing: { after: 60 },
              })
          ),

          // Output Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Output',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          ...labRecord.output.split('\n').map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24,
                    font: 'Calibri',
                  }),
                ],
                spacing: { after: 120 },
              })
          ),

          // Graph Section (if required)
          ...(labRecord.graphRequired && labRecord.graphData
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Graph',
                      bold: true,
                      size: 28,
                      font: 'Calibri',
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${labRecord.graphData.xAxis} vs ${labRecord.graphData.yAxis}`,
                      size: 24,
                      font: 'Calibri',
                      italics: true,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                // Embed graph image if available
                ...(graphImageBuffer
                  ? [
                      new Paragraph({
                        children: [
                          new ImageRun({
                            data: graphImageBuffer,
                            transformation: {
                              width: 550,
                              height: 400,
                            },
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                      }),
                    ]
                  : [
                      // Fallback to table if no image
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Note: Please plot the following data points in a graph',
                            size: 22,
                            font: 'Calibri',
                            italics: true,
                            color: '666666',
                          }),
                        ],
                        spacing: { after: 200 },
                      }),
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE,
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
                          left: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
                          right: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
                          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: 'Sr. No.',
                                        bold: true,
                                        size: 24,
                                        font: 'Calibri',
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: '3B82F6', type: 'clear' },
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: labRecord.graphData!.xAxis,
                                        bold: true,
                                        size: 24,
                                        font: 'Calibri',
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: '3B82F6', type: 'clear' },
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: labRecord.graphData!.yAxis,
                                        bold: true,
                                        size: 24,
                                        font: 'Calibri',
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: '3B82F6', type: 'clear' },
                              }),
                            ],
                          }),
                          ...labRecord.graphData!.points.map(
                            (point, index) =>
                              new TableRow({
                                children: [
                                  new TableCell({
                                    children: [
                                      new Paragraph({
                                        children: [new TextRun({ text: String(index + 1), size: 22, font: 'Calibri' })],
                                        alignment: AlignmentType.CENTER,
                                      }),
                                    ],
                                    shading: { fill: index % 2 === 0 ? 'F0F7FF' : 'FFFFFF', type: 'clear' },
                                  }),
                                  new TableCell({
                                    children: [
                                      new Paragraph({
                                        children: [new TextRun({ text: String(point.x), size: 22, font: 'Calibri' })],
                                        alignment: AlignmentType.CENTER,
                                      }),
                                    ],
                                    shading: { fill: index % 2 === 0 ? 'F0F7FF' : 'FFFFFF', type: 'clear' },
                                  }),
                                  new TableCell({
                                    children: [
                                      new Paragraph({
                                        children: [new TextRun({ text: String(point.y), size: 22, font: 'Calibri' })],
                                        alignment: AlignmentType.CENTER,
                                      }),
                                    ],
                                    shading: { fill: index % 2 === 0 ? 'F0F7FF' : 'FFFFFF', type: 'clear' },
                                  }),
                                ],
                              })
                          ),
                        ],
                      }),
                    ]),
              ]
            : []),

          // Visual Output Section (for GUI/Applet/Graphics experiments)
          ...(labRecord.hasVisualOutput
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Visual Output',
                      bold: true,
                      size: 28,
                      font: 'Calibri',
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 200 },
                }),
                ...(labRecord.visualOutputDescription
                  ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: labRecord.visualOutputDescription,
                            size: 24,
                            font: 'Calibri',
                            italics: true,
                          }),
                        ],
                        spacing: { after: 200 },
                      }),
                    ]
                  : []),
                // Embed visual output image if available
                ...(visualOutputImageBuffer
                  ? [
                      new Paragraph({
                        children: [
                          new ImageRun({
                            data: visualOutputImageBuffer,
                            transformation: {
                              width: 550,
                              height: 400,
                            },
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                      }),
                    ]
                  : []),
              ]
            : []),

          // Learning Outcomes Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Learning Outcomes',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          ...labRecord.learningOutcomes.map(
            (outcome) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${outcome}`,
                    size: 24,
                    font: 'Calibri',
                  }),
                ],
                spacing: { after: 120 },
              })
          ),

          // Viva Questions Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'Viva Questions',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          ...labRecord.vivaQuestions.flatMap((qa) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Q: ${qa.question}`,
                  bold: true,
                  size: 24,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 120 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `A: ${qa.answer}`,
                  size: 24,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 200 },
            }),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
