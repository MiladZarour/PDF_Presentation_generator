import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const loadPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Get metadata
  const metadata = await pdfDocument.getMetadata();
  
  // Collect page data
  const pagesData = [];
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    
    pagesData.push({
      pageNumber: i,
      textContent,
      viewport: page.getViewport({ scale: 1.0 }),
    });
  }
  
  return {
    document: pdfDocument,
    metadata,
    pages: pagesData,
    numPages: pdfDocument.numPages,
  };
};

export const extractTextFromPage = (textContent) => {
  if (!textContent) return '';
  
  return textContent.items
    .map(item => item.str)
    .join(' ');
};

export const extractTextFromDocument = (pdfData) => {
  if (!pdfData?.pages) return '';
  
  return pdfData.pages
    .map(page => extractTextFromPage(page.textContent))
    .join('\n\n');
};

export const extractDocumentStructure = async (pdfDocument) => {
  if (!pdfDocument) return null;
  
  try {
    const outline = await pdfDocument.getOutline();
    return outline || [];
  } catch (error) {
    console.error("Error extracting document structure:", error);
    return null;
  }
};

export const extractImages = async (pdfData) => {
  if (!pdfData?.document) return [];
  
  const images = [];
  
  for (let i = 1; i <= pdfData.numPages; i++) {
    const page = await pdfData.document.getPage(i);
    const operatorList = await page.getOperatorList();
    
    for (let j = 0; j < operatorList.fnArray.length; j++) {
      if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
        const imgIndex = operatorList.argsArray[j][0];
        const img = page.objs.get(imgIndex);
        
        if (img) {
          images.push({
            pageNumber: i,
            imageData: img,
            index: images.length
          });
        }
      }
    }
  }
  
  return images;
};