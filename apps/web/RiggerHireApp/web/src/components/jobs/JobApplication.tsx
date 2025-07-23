import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';

const ApplicationCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  backgroundColor: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  marginTop: theme.spacing(4),
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  color: '#000',
  ':hover': {
    background: 'linear-gradient(45deg, #5fffff, #ff5fff)',
  },
}));

interface JobApplicationProps {
  jobId: string;
  onSubmit: (formData: { resume: string; coverLetter: string; availability: string }) => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ jobId, onSubmit }) => {
  const [formData, setFormData] = useState({
    resume: '',
    coverLetter: '',
    availability: '',
  });

  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume || !formData.coverLetter || !formData.availability) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <ApplicationCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Apply for Job ID: {jobId}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            select
            label="Availability"
            value={formData.availability}
            onChange={handleChange('availability')}
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="Immediately">Immediately</MenuItem>
            <MenuItem value="1 Week">1 Week</MenuItem>
            <MenuItem value="2 Weeks">2 Weeks</MenuItem>
            <MenuItem value="1 Month">1 Month</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Resume Link"
            value={formData.resume}
            onChange={handleChange('resume')}
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Cover Letter"
            value={formData.coverLetter}
            onChange={handleChange('coverLetter')}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
          />

          <Divider sx={{ my: 2 }} />

          <ApplyButton type="submit" fullWidth variant="contained">
            Submit Application
          </ApplyButton>
        </form>
      </CardContent>
    </ApplicationCard>
  );
};

export default JobApplication;

