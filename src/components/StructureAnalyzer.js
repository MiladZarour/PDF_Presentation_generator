import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { extractDocumentStructure } from '../utils/pdfUtils';

const StructureAnalyzer = ({ pdfData }) => {
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState(null);

  useEffect(() => {
    const analyzeStructure = async () => {
      if (!pdfData || !pdfData.document) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const outline = await extractDocumentStructure(pdfData.document);
        setStructure(outline);
      } catch (error) {
        console.error("Error analyzing document structure:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeStructure();
  }, [pdfData]);

  const renderOutlineItems = (items) => {
    if (!items || items.length === 0) {
      return <Typography variant="body2" color="text.secondary">No outline items found in document</Typography>;
    }

    return (
      <List>
        {items.map((item, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                secondary={item.dest ? `Page: ${typeof item.dest === 'object' ? item.dest[0] : 'Unknown'}` : null}
              />
            </ListItem>
            {item.items && item.items.length > 0 && (
              <Box sx={{ pl: 4 }}>
                {renderOutlineItems(item.items)}
              </Box>
            )}
          </Box>
        ))}
      </List>
    );
  };

  // Document Structure visualization showing page count, text content items, and outline
  const renderStructureAnalysis = () => {
    if (!pdfData) {
      return <Typography variant="body1">No document loaded</Typography>;
    }

    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Document Overview</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Number of Pages:</strong> {pdfData.numPages}</Typography>
            <Typography><strong>Text Items:</strong> {
              pdfData.pages.reduce((total, page) => total + (page.textContent?.items.length || 0), 0)
            }</Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Document Outline</Typography>
          {renderOutlineItems(structure)}
        </Paper>
      </Box>
    );
  };

  if (!pdfData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No PDF document loaded</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Analyzing document structure...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {renderStructureAnalysis()}
    </Box>
  );
};

export default StructureAnalyzer;