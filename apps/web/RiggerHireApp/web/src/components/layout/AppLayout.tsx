import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer } from '@mui/material';
import {
  Menu as MenuIcon,
  Work as JobsIcon,
  Assignment as MyJobsIcon,
  Search as SearchIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const AppWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  background: '#0a0a0a',
  color: theme.palette.text.primary,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 255, 255, 0.1)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(0, 255, 255, 0.1)',
    boxSizing: 'border-box',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64,
}));

const MenuItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '&:hover': {
    background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    { icon: <JobsIcon />, text: 'Jobs', path: '/jobs' },
    { icon: <MyJobsIcon />, text: 'My Jobs', path: '/my-jobs' },
    { icon: <SearchIcon />, text: 'Search', path: '/search' },
    { icon: <ProfileIcon />, text: 'Profile', path: '/profile' },
    { icon: <SettingsIcon />, text: 'Settings', path: '/settings' },
  ];

  const drawer = (
    <Box>
      {menuItems.map((item) => (
        <MenuItem key={item.path}>
          {item.icon}
          <Typography>{item.text}</Typography>
        </MenuItem>
      ))}
    </Box>
  );

  return (
    <AppWrapper>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            RiggerHireApp
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' } }}
        open
      >
        {drawer}
      </StyledDrawer>

      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        {drawer}
      </StyledDrawer>

      <MainContent>{children}</MainContent>
    </AppWrapper>
  );
};

export default AppLayout;
