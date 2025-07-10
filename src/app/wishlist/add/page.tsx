'use client';

import React from 'react';
import PinForm from '@/components/PinForm';
import { Pin } from '@/types/pin';
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';

export default function AddWishlistPinPage() {
  return (
    <RequireAuth>
      <AddWishlistPinPageContent />
    </RequireAuth>
  );
}

function AddWishlistPinPageContent() {
  const router = useRouter();

  const handleSubmit = async (pin: Pin) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pin.name,
          description: pin.description,
          image: pin.photos?.[0] || '',
          category: pin.category,
          countryOfOrigin: pin.countryOfOrigin,
          eventOfOrigin: pin.eventOfOrigin,
        }),
      });

      if (response.ok) {
        alert('New wishlist pin created successfully!');
        router.push('/wishlist');
      } else {
        const errorData = await response.json();
        alert(`Failed to create wishlist pin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit wishlist pin:', error);
      alert('An error occurred while creating the wishlist pin.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>Add a New Wishlist Pin</Typography>
      <PinForm onSubmit={handleSubmit} isWishlist={true} />
    </Container>
  );
}
