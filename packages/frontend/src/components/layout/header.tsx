import { FC } from 'react';
import { Box } from '@mui/material';

interface HeaderBarProps {
  logoSrc: string;
  alt?: string;
}

export const HeaderBar: FC<HeaderBarProps> = ({ logoSrc, alt = 'Boston University' }) => {
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',  
        top: 0,
        left: 0,    
        right: 0,   
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: 'white',
        py: 1.25,
        px: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src={logoSrc}
          alt={alt}
          sx={{ height: { xs: 32, sm: 44 }, width: 'auto', display: 'block' }}
        />
      </Box>
    </Box>
  );
};