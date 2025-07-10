'use client';

import React, { useState, useEffect } from 'react';
import PinForm from '@/components/PinForm';
import { Pin } from '@/types/pin';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { useRouter, notFound, useParams } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';

export default function EditWishlistPinPage() {
  return (
    <RequireAuth>
      <EditWishlistPinPageContent />
    </RequireAuth>
  );
}

function EditWishlistPinPageContent() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPin = async () => {
        try {
          const response = await fetch(`/api/wishlist/${id}`);
          if (!response.ok) {
            notFound();
            return;
          }
          const data = await response.json();
          setPin(data);
        } catch (error) {
          console.error('Failed to fetch wishlist pin:', error);
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
      const response = await fetch(`/api/wishlist/${updatedPin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPin),
      });

      if (response.ok) {
        alert('Wishlist pin updated successfully!');
        router.push(`/wishlist/${updatedPin.id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update wishlist pin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit wishlist pin:', error);
      alert('An error occurred while updating the wishlist pin.');
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
      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>Edit Wishlist Pin</Typography>
      <PinForm pin={pin} onSubmit={handleSubmit} isWishlist={true} />
    </Container>
  );
}
