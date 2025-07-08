'use client';

import React from 'react';
import PinForm from '@/components/PinForm';
import { Pin } from '@/types/pin';
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AddPinPage() {
  const router = useRouter();

  const handleSubmit = async (pin: Pin) => {
    try {
      const response = await fetch('/api/pins/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pin),
      });

      if (response.ok) {
        alert('New pin created successfully!');
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(`Failed to create pin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit pin:', error);
      alert('An error occurred while creating the pin.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>Add a New Pin</Typography>
      <PinForm onSubmit={handleSubmit} />
    </Container>
  );
}
