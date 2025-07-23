import React from 'react';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: 'rgba(0, 255, 255, 0.3)',
      transition: 'all 0.2s ease-in-out',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiFormHelperText-root': {
    color: theme.palette.text.secondary,
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

interface ThemedInputProps extends Omit<TextFieldProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const ThemedInput: React.FC<ThemedInputProps> = ({ 
  startIcon,
  endIcon,
  error,
  helperText,
  ...props 
}) => {
  return (
    <StyledTextField
      variant="outlined"
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default ThemedInput;
