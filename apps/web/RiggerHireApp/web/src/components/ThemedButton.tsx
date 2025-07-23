import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  color: theme.palette.primary.contrastText,
  '&:hover': {
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    background: 'linear-gradient(45deg, #5fffff, #ff5fff)',
  },
}));

interface CustomButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
}

const ThemedButton: React.FC<CustomButtonProps> = ({ onClick, children, variant = 'contained', disabled = false }) => {
  return (
    <CustomButton variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </CustomButton>
  );
};

export default ThemedButton;
