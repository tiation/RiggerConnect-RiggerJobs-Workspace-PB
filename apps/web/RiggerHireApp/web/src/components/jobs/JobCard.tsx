import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MonetizationOn as RateIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 255, 255, 0.2)',
  },
}));

const JobTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const StatusChip = styled(Chip)<{ status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' }>(
  ({ theme, status }) => ({
    background:
      status === 'OPEN'
        ? 'rgba(0, 255, 159, 0.1)'
        : status === 'IN_PROGRESS'
        ? 'rgba(0, 255, 255, 0.1)'
        : 'rgba(255, 0, 255, 0.1)',
    color:
      status === 'OPEN'
        ? theme.palette.success.main
        : status === 'IN_PROGRESS'
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
    border: `1px solid ${
      status === 'OPEN'
        ? theme.palette.success.main
        : status === 'IN_PROGRESS'
        ? theme.palette.primary.main
        : theme.palette.secondary.main
    }`,
  })
);

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  padding: '8px 24px',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  '&.MuiButton-contained': {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    color: '#000000',
    boxShadow: '0 4px 20px rgba(0, 255, 255, 0.3)',
    '&:hover': {
      background: 'linear-gradient(45deg, #5fffff, #ff5fff)',
      boxShadow: '0 4px 30px rgba(0, 255, 255, 0.5)',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      borderColor: theme.palette.primary.light,
      color: theme.palette.primary.light,
    },
  },
}));

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    rate: number;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    duration: string;
    description: string;
  };
  onApply: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onViewDetails }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <JobTitle variant="h5">{job.title}</JobTitle>
          <StatusChip
            label={job.status.replace('_', ' ')}
            status={job.status}
          />
        </Box>

        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
        >
          {job.company}
        </Typography>

        <InfoRow>
          <LocationIcon />
          <Typography variant="body2">{job.location}</Typography>
        </InfoRow>

        <InfoRow>
          <RateIcon />
          <Typography variant="body2">
            ${job.rate.toFixed(2)}/hr
          </Typography>
        </InfoRow>

        <InfoRow>
          <ScheduleIcon />
          <Typography variant="body2">{job.duration}</Typography>
        </InfoRow>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mt: 2,
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {job.description}
        </Typography>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ActionButton
            variant="outlined"
            onClick={() => onViewDetails(job.id)}
          >
            View Details
          </ActionButton>
          {job.status === 'OPEN' && (
            <ActionButton
              variant="contained"
              onClick={() => onApply(job.id)}
            >
              Apply Now
            </ActionButton>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default JobCard;
