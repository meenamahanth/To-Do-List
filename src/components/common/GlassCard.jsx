import React from 'react';
import { Paper } from '@mui/material';
import { motion } from 'framer-motion';

const GlassCard = ({ children, sx = {}, hoverable = true, onClick, ...props }) => {
  const animatedProps = hoverable 
    ? {
        component: motion.div,
        whileHover: { 
          y: -5,
          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.12)',
        },
        transition: { duration: 0.25, ease: 'easeOut' }
      }
    : {};

  return (
    <Paper
      {...animatedProps}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default GlassCard;
