import React from 'react';
import { Button, Box } from '@mui/material';
import Image from 'next/image';

const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:6969/api/auth/google';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      fullWidth
      variant="outlined"
      sx={{
        mt: 2,
        borderRadius: '18px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        borderColor: '#ddd',
        color: '#333',
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#f5f5f5'
        }
      }}
      startIcon={
        <Image
          src="https://i.pinimg.com/474x/0c/c9/86/0cc9865a54873cc38326e37fb8a5a6c9.jpg"
          alt="Google"
          width={20}
          height={20}
        />
      }
    >
      Login as Team Leader
    </Button>
  );
};

export default GoogleLoginButton;
