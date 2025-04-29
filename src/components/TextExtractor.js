import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Tabs, Tab, Button } from '@mui/material';
import { extractTextFromDocument, extractTextFromPage } from '../utils/pdfUtils';

const TextExtractor = ({ pdfData }) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const extractText = async () => {
      if (!pdfData) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (tabValue === 0) {
          // Extract text from the entire document
          const fullText = extractTextFromDocument(pdfData);
          setText(fullText);
        } else {
          // Extract text from current page
          const page = pdfData.pages.find(p => p.pageNumber === currentPage);
          if (page) {
            const pageText = extractTextFromPage(page.textContent);
            setText(pageText);
          } else {
            setText('');
          }
        }
      } catch (error) {
        console.error("Error extracting text:", error);
        setText('Error extracting text from PDF');
      } finally {
        setLoading(false);
      }
    };

    extractText();
  }, [pdfData, tabValue, currentPage]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pdfData && currentPage < pdfData.numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!pdfData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No PDF document loaded</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Full Document" />
          <Tab label="Page by Page" />
        </Tabs>
      </Box>

      {tabValue === 1 && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>
            Page {currentPage} of {pdfData.numPages}
          </Typography>
          <Box>
            <Button 
              onClick={handlePreviousPage} 
              disabled={currentPage <= 1}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            >
              Previous Page
            </Button>
            <Button 
              onClick={handleNextPage} 
              disabled={currentPage >= pdfData.numPages}
              variant="outlined"
              size="small"
            >
              Next Page
            </Button>
          </Box>
        </Box>
      )}

      <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Extracting text...</Typography>
          </Box>
        ) : (
          <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {text || 'No text content found in the document.'}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TextExtractor;