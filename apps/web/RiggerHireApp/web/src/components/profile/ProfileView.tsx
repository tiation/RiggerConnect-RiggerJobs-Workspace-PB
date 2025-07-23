import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Description as DocumentIcon,
  WorkOutline as CertificationIcon,
  Star as SkillsIcon,
  Timeline as ExperienceIcon,
  Collections as PortfolioIcon,
  RateReview as ReviewsIcon,
  ChevronRight as ChevronIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid',
  borderColor: theme.palette.primary.main,
  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginTop: theme.spacing(2),
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.6)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  padding: theme.spacing(2),
  textAlign: 'center',
  '&:hover': {
    background: 'rgba(26, 26, 26, 0.8)',
    transform: 'translateY(-4px)',
    transition: 'all 0.2s ease-in-out',
  },
}));

interface ProfileViewProps {
  user: {
    name: string;
    role: string;
    avatar: string;
    stats: {
      completedJobs: number;
      rating: number;
      yearsExperience: number;
    };
  };
  onNavigate: (path: string) => void;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onNavigate, onEdit }) => {
  const menuItems = [
    { icon: <DocumentIcon />, text: 'Documents', path: '/documents' },
    { icon: <CertificationIcon />, text: 'Certifications', path: '/certifications' },
    { icon: <SkillsIcon />, text: 'Skills', path: '/skills' },
    { icon: <ExperienceIcon />, text: 'Experience', path: '/experience' },
    { icon: <PortfolioIcon />, text: 'Portfolio', path: '/portfolio' },
    { icon: <ReviewsIcon />, text: 'Reviews', path: '/reviews' },
  ];

  return (
    <Box>
      <ProfileCard>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onEdit} color="primary">
            <EditIcon />
          </IconButton>
        </Box>
        
        <Box display="flex" flexDirection="column" alignItems="center">
          <LargeAvatar src={user.avatar} alt={user.name} />
          <ProfileName>{user.name}</ProfileName>
          <Typography variant="subtitle1" color="textSecondary">
            {user.role}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={4}>
            <StatCard>
              <Typography variant="h4" color="primary">
                {user.stats.completedJobs}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Jobs Completed
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={4}>
            <StatCard>
              <Typography variant="h4" color="primary">
                {user.stats.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rating
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={4}>
            <StatCard>
              <Typography variant="h4" color="primary">
                {user.stats.yearsExperience}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Years Experience
              </Typography>
            </StatCard>
          </Grid>
        </Grid>
      </ProfileCard>

      <List sx={{ mt: 3 }}>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.path}
            button
            onClick={() => onNavigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            <ListItemSecondaryAction>
              <ChevronIcon />
            </ListItemSecondaryAction>
          </StyledListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProfileView;
