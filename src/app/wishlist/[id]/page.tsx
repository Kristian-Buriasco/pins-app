'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Chip, Box, Button, CircularProgress } from '@mui/material';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Pin } from '@/types/pin';
import RequireAuth from '@/components/RequireAuth';

export default function WishlistPinDetailPage() {
  return (
    <RequireAuth>
      <WishlistPinDetailPageContent />
    </RequireAuth>
  );
}

function WishlistPinDetailPageContent() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this wishlist pin? This action cannot be undone.')) {
      try {
        const pinId = (pin && ((pin as { _id?: string })._id || pin.objectId || pin.id)) || '';
        if (!pinId) {
          alert('Invalid wishlist pin ID');
          return;
        }
        const response = await fetch(`/api/wishlist/${pinId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Wishlist pin deleted successfully!');
          router.push('/wishlist');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete wishlist pin: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to delete wishlist pin:', error);
        alert('An error occurred while deleting the wishlist pin.');
      }
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
      <Paper sx={{ padding: '2rem', marginTop: '2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
              <Image
                src={pin.photos?.[0] || '/placeholder.png'}
                alt={pin.name || 'Wishlist Pin'}
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </div>
          <div>
            <Typography variant="h4" gutterBottom>{pin.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {pin.eventOfOrigin} - {pin.countryOfOrigin}
            </Typography>
            <Typography variant="body1" paragraph>{pin.description}</Typography>
            <Chip label={`Category: ${pin.category}`} sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} />
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={() => router.push(`/wishlist/${(pin && ((pin as { _id?: string })._id || pin.objectId || pin.id)) || ''}/edit`)}>Edit Wishlist Pin</Button>
              <Button variant="contained" color="error" onClick={handleDelete} sx={{ marginLeft: '1rem' }}>
                Delete Wishlist Pin
              </Button>
            </Box>
          </div>
        </div>
      </Paper>
    </Container>
  );
}
