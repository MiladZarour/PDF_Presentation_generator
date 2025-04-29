import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { extractImages } from '../utils/pdfUtils';

const ImageAnalyzer = ({ pdfData }) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const analyzeImages = async () => {
      if (!pdfData || !pdfData.document) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const extractedImages = await extractImages(pdfData);
        setImages(extractedImages);
      } catch (error) {
        console.error("Error extracting images:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeImages();
  }, [pdfData]);

  const renderImageCard = (imageData, index) => {
    // In a real implementation, we would convert the PDF image data to a displayable format
    // For simplicity, we're just showing placeholders
    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          <CardMedia
            component="div"
            sx={{
              height: 200,
              backgroundColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              [Image Preview Placeholder]
            </Typography>
          </CardMedia>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Image {index + 1} (Page {imageData.pageNumber})
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
        <Typography variant="h6" sx={{ ml: 2 }}>Analyzing images...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Image Analysis</Typography>
        <Typography variant="body2" paragraph>
          {images.length > 0 
            ? `Found ${images.length} images in the document`
            : 'No images detected in the document'}
        </Typography>
      </Paper>

      {images.length > 0 && (
        <Grid container spacing={3}>
          {images.map((image, index) => renderImageCard(image, index))}
        </Grid>
      )}
    </Box>
  );
};

export default ImageAnalyzer;