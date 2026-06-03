import React from 'react';
import { Chip, useTheme } from '@mui/material';

const CustomBadge = ({ type, value, size = 'small', sx = {}, ...props }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getStyle = () => {
    const val = String(value).toLowerCase();

    // Priority styles
    if (type === 'priority') {
      switch (val) {
        case 'high':
          return {
            color: isDark ? '#fda4af' : '#e11d48',
            backgroundColor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(225, 29, 72, 0.08)',
            borderColor: isDark ? 'rgba(244, 63, 94, 0.3)' : 'rgba(225, 29, 72, 0.2)',
          };
        case 'medium':
          return {
            color: isDark ? '#fde047' : '#d97706',
            backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(217, 119, 6, 0.08)',
            borderColor: isDark ? 'rgba(234, 179, 8, 0.3)' : 'rgba(217, 119, 6, 0.2)',
          };
        case 'low':
        default:
          return {
            color: isDark ? '#93c5fd' : '#2563eb',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
          };
      }
    }

    // Status styles
    if (type === 'status') {
      switch (val) {
        case 'completed':
          return {
            color: isDark ? '#6ee7b7' : '#059669',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.08)',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.2)',
          };
        case 'in-progress':
          return {
            color: isDark ? '#60a5fa' : '#2563eb',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
          };
        case 'review':
          return {
            color: isDark ? '#c084fc' : '#7c3aed',
            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.08)',
            borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.2)',
          };
        case 'todo':
        default:
          return {
            color: isDark ? '#cbd5e1' : '#475569',
            backgroundColor: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(71, 85, 105, 0.08)',
            borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(71, 85, 105, 0.2)',
          };
      }
    }

    // Category styles (Work, Design, Dev, Marketing, Personal)
    switch (val) {
      case 'design':
        return {
          color: isDark ? '#f472b6' : '#db2777',
          backgroundColor: isDark ? 'rgba(236, 72, 153, 0.12)' : 'rgba(219, 39, 119, 0.06)',
          borderColor: isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(219, 39, 119, 0.15)',
        };
      case 'dev':
        return {
          color: isDark ? '#a78bfa' : '#6d28d9',
          backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(109, 40, 217, 0.06)',
          borderColor: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(109, 40, 217, 0.15)',
        };
      case 'marketing':
        return {
          color: isDark ? '#2dd4bf' : '#0d9488',
          backgroundColor: isDark ? 'rgba(20, 184, 166, 0.12)' : 'rgba(13, 148, 136, 0.06)',
          borderColor: isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.15)',
        };
      case 'personal':
        return {
          color: isDark ? '#fb923c' : '#ea580c',
          backgroundColor: isDark ? 'rgba(249, 115, 22, 0.12)' : 'rgba(234, 88, 12, 0.06)',
          borderColor: isDark ? 'rgba(249, 115, 22, 0.25)' : 'rgba(234, 88, 12, 0.15)',
        };
      case 'work':
      default:
        return {
          color: isDark ? '#38bdf8' : '#0284c7',
          backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.06)',
          borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.15)',
        };
    }
  };

  const currentStyle = getStyle();

  return (
    <Chip
      label={value}
      size={size}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.725rem' : '0.8rem',
        borderRadius: '8px',
        border: '1px solid',
        ...currentStyle,
        ...sx,
      }}
      {...props}
    />
  );
};

export default CustomBadge;
