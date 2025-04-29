import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';

const drawerWidth = 240;

const navItems = [
  { id: 'viewer', text: 'PDF Viewer', icon: <VisibilityIcon /> },
  { id: 'text', text: 'Text Extraction', icon: <TextFieldsIcon /> },
  { id: 'structure', text: 'Document Structure', icon: <AccountTreeIcon /> },
  { id: 'metadata', text: 'Metadata', icon: <InfoIcon /> },
  { id: 'images', text: 'Images', icon: <ImageIcon /> },
];

const Sidebar = ({ currentView, setCurrentView, fileUploaded }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
                disabled={!fileUploaded && item.id !== 'viewer'}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Upload a PDF to analyze its content and structure
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;