import React from 'react';
import { Chip, Typography } from '@mui/material';

interface BadgeProps {
  label?: string;
  fallback: string;
}

const Badge: React.FC<BadgeProps> = ({ label, fallback }) =>
  label ? (
    <Chip label={label} color="success" size="small" sx={{ mb: 1, mr: 1 }} />
  ) : (
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mr: 1 }}>
      {fallback}
    </Typography>
  );

export default Badge;