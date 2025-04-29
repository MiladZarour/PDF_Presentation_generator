import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PdfUploader from './components/PdfUploader';
import PdfViewer from './components/PdfViewer';
import TextExtractor from './components/TextExtractor';
import StructureAnalyzer from './components/StructureAnalyzer';
import MetadataDisplay from './components/MetadataDisplay';
import ImageAnalyzer from './components/ImageAnalyzer';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [currentView, setCurrentView] = useState('viewer');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  const handleFileUpload = (newFile) => {
    setFile(newFile);
    setPdfData(null); // Reset PDF data when new file is uploaded
  };

  const handlePdfLoaded = (data) => {
    setPdfData(data);
  };

  const renderCurrentView = () => {
    if (!file) {
      return <PdfUploader onFileUploaded={handleFileUpload} />;
    }

    switch (currentView) {
      case 'viewer':
        return <PdfViewer file={file} onPdfLoaded={handlePdfLoaded} />;
      case 'text':
        return <TextExtractor pdfData={pdfData} />;
      case 'structure':
        return <StructureAnalyzer pdfData={pdfData} />;
      case 'metadata':
        return <MetadataDisplay pdfData={pdfData} />;
      case 'images':
        return <ImageAnalyzer pdfData={pdfData} />;
      default:
        return <PdfViewer file={file} onPdfLoaded={handlePdfLoaded} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Sidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            fileUploaded={!!file}
          />
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            {renderCurrentView()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;