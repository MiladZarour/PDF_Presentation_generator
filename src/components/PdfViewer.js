import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { loadPdf } from '../utils/pdfUtils';

const PdfViewer = ({ file, onPdfLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!file) return;
      
      setLoading(true);
      
      try {
        const pdfData = await loadPdf(file);
        setPdfDocument(pdfData);
        onPdfLoaded(pdfData);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDocument();
  }, [file, onPdfLoaded]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current) return;
      
      try {
        const page = pdfDocument.pages.find(p => p.pageNumber === currentPage);
        if (!page) return;
        
        const viewport = page.viewport;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height * scale;
        canvas.width = viewport.width * scale;
        
        const renderContext = {
          canvasContext: context,
          viewport: page.viewport.clone({ scale }),
        };
        
        // Render the page
        const renderPage = await pdfDocument.document.getPage(currentPage);
        await renderPage.render(renderContext).promise;
        
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };
    
    renderPage();
  }, [pdfDocument, currentPage, scale]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pdfDocument && currentPage < pdfDocument.numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading PDF...</Typography>
      </Box>
    );
  }

  if (!pdfDocument) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No PDF document loaded</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {file.name} (Page {currentPage} of {pdfDocument.numPages})
        </Typography>
        <Box>
          <button onClick={handleZoomOut} disabled={scale <= 0.5}>-</button>
          <Typography component="span" sx={{ mx: 1 }}>{Math.round(scale * 100)}%</Typography>
          <button onClick={handleZoomIn} disabled={scale >= 3.0}>+</button>
        </Box>
      </Box>
      
      <Paper sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        display: 'flex', 
        justifyContent: 'center',
        p: 2 
      }}>
        <canvas ref={canvasRef} />
      </Paper>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handlePreviousPage} disabled={currentPage <= 1}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={currentPage >= pdfDocument.numPages}>
          Next Page
        </button>
      </Box>
    </Box>
  );
};

export default PdfViewer;