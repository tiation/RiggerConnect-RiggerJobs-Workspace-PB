import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  People,
  WorkOutline,
  Star,
  AttachMoney,
} from '@mui/icons-material';

const DashboardCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 255, 255, 0.2)',
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '2rem',
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(0, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  },
}));

interface AnalyticsDashboardProps {
  stats: {
    applicationsSubmitted: number;
    successRate: number;
    activeJobs: number;
    totalEarnings: number;
    averageRating: number;
    completedJobs: number;
  };
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Applications',
      value: stats.applicationsSubmitted,
      icon: <Timeline />,
      progress: (stats.applicationsSubmitted / 100) * 100,
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <TrendingUp />,
      progress: stats.successRate,
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: <People />,
      progress: (stats.activeJobs / 10) * 100,
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: <AttachMoney />,
      progress: (stats.totalEarnings / 10000) * 100,
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: <Star />,
      progress: (stats.averageRating / 5) * 100,
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: <WorkOutline />,
      progress: (stats.completedJobs / 50) * 100,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <DashboardCard>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <IconWrapper>
                  {card.icon}
                </IconWrapper>
                
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  {card.title}
                </Typography>
                
                <StatValue variant="h4">
                  {card.value}
                </StatValue>

                <Box width="100%" mt={2}>
                  <ProgressBar
                    variant="determinate"
                    value={Math.min(card.progress, 100)}
                  />
                </Box>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsDashboard;
