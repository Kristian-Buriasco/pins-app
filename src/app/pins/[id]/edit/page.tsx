'use client';

import React, { useState, useEffect } from 'react';
import PinForm from '@/components/PinForm';
import { Pin } from '@/types/pin';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { useRouter, notFound, useParams } from 'next/navigation';

export default function EditPinPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPin = async () => {
        try {
          const response = await fetch(`/api/pins/${id}`);
          if (!response.ok) {
            notFound();
            return;
          }
          const data = await response.json();
          setPin(data);
        } catch (error) {
          console.error('Failed to fetch pin:', error);
          notFound();
        } finally {
          setLoading(false);
        }
      };
      fetchPin();
    }
  }, [id]);

  const handleSubmit = async (updatedPin: Pin) => {
    try {
      const response = await fetch(`/api/pins/${updatedPin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPin),
      });

      if (response.ok) {
        alert('Pin updated successfully!');
        router.push(`/pins/${updatedPin.id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update pin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit pin:', error);
      alert('An error occurred while updating the pin.');
    }
  };

  if (loading) {
    return <Container><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Container>;
  }

  if (!pin) {
    return notFound();
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>Edit Pin</Typography>
      <PinForm pin={pin} onSubmit={handleSubmit} />
    </Container>
  );
}
