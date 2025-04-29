import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const MetadataDisplay = ({ pdfData }) => {
  if (!pdfData || !pdfData.metadata) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No PDF document loaded or no metadata available</Typography>
      </Box>
    );
  }

  const { metadata } = pdfData;
  const info = metadata.info || {};
  const metadataEntries = [
    { key: 'Title', value: info.Title || 'N/A' },
    { key: 'Author', value: info.Author || 'N/A' },
    { key: 'Subject', value: info.Subject || 'N/A' },
    { key: 'Keywords', value: info.Keywords || 'N/A' },
    { key: 'Creator', value: info.Creator || 'N/A' },
    { key: 'Producer', value: info.Producer || 'N/A' },
    { key: 'Creation Date', value: info.CreationDate ? new Date(info.CreationDate).toLocaleString() : 'N/A' },
    { key: 'Modification Date', value: info.ModDate ? new Date(info.ModDate).toLocaleString() : 'N/A' },
    { key: 'PDF Version', value: metadata.contentDispositionFilename || 'N/A' },
    { key: 'Page Count', value: pdfData.numPages },
  ];

  return (
    <Box sx={{ height: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Document Metadata</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Metadata provides information about the PDF document, such as its author, creation date, and other properties.
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metadataEntries.map((entry) => (
                <TableRow key={entry.key}>
                  <TableCell>{entry.key}</TableCell>
                  <TableCell>{entry.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Additional metadata or custom properties if available */}
      {info.Custom && Object.keys(info.Custom).length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Custom Properties</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(info.Custom).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default MetadataDisplay;