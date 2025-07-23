import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Job } from '@riggerhireapp/shared';
import ThemedButton from './ThemedButton';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
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
    transition: 'transform 0.2s ease-in-out',
    boxShadow: '0 8px 30px rgba(0, 255, 255, 0.2)',
  },
}));

const JobStatus = styled(Typography)<{ status: Job['status'] }>(({ theme, status }) => ({
  padding: '4px 12px',
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  background: status === 'OPEN' 
    ? 'rgba(0, 255, 159, 0.1)'
    : status === 'IN_PROGRESS'
    ? 'rgba(0, 255, 255, 0.1)'
    : 'rgba(255, 0, 255, 0.1)',
  color: status === 'OPEN'
    ? theme.palette.success.main
    : status === 'IN_PROGRESS'
    ? theme.palette.primary.main
    : theme.palette.secondary.main,
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  onViewDetails?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onViewDetails }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {job.title}
          </Typography>
          <JobStatus status={job.status}>
            {job.status.replace('_', ' ')}
          </JobStatus>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            maxHeight: '4.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {job.description}
        </Typography>

        <InfoRow>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2">{job.location}</Typography>
        </InfoRow>

        <InfoRow>
          <MonetizationOnIcon fontSize="small" />
          <Typography variant="body2">
            ${job.rate.toFixed(2)}/hr
          </Typography>
        </InfoRow>
      </CardContent>

      <CardActions sx={{ padding: 2, justifyContent: 'flex-end', gap: 1 }}>
        <ThemedButton
          variant="outlined"
          onClick={onViewDetails}
        >
          View Details
        </ThemedButton>
        {job.status === 'OPEN' && (
          <ThemedButton
            onClick={onApply}
          >
            Apply Now
          </ThemedButton>
        )}
      </CardActions>
    </StyledCard>
  );
};

export default JobCard;
