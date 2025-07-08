'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Chip, Box, Button, CircularProgress } from '@mui/material';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import InventoryAlert from '@/components/InventoryAlert';
import { Pin } from '@/types/pin';
import Grid from '@mui/material/Unstable_Grid2';

export default function PinDetailPage({ params }: { params: { id: string } }) {
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      const fetchPin = async () => {
        try {
          const response = await fetch(`/api/pins/${params.id}`);
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
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pin? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/pins/${params.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Pin deleted successfully!');
          router.push('/');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete pin: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to delete pin:', error);
        alert('An error occurred while deleting the pin.');
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
              <Image
                src={pin.photos[0] || '/placeholder.png'}
                alt={pin.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
            {pin.photos.length > 1 && (
              <Grid container spacing={1} sx={{ marginTop: '1rem' }}>
                {pin.photos.map((photo, index) => (
                  <Grid item key={index} xs={3}>
                     <Box sx={{ position: 'relative', width: '100%', height: '80px' }}>
                        <Image
                            src={photo}
                            alt={`${pin.name} thumbnail ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                     </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{pin.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {pin.eventOfOrigin} - {pin.countryOfOrigin}
            </Typography>
            <Typography variant="body1" paragraph>{pin.description}</Typography>
            
            <Chip label={`Category: ${pin.category}`} sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} />
            <Chip label={`Value: ${pin.value}/10`} sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} />
            
            <Typography variant="h6" sx={{ marginTop: '1.5rem' }}>Details</Typography>
            <Typography variant="body2"><strong>Location Found:</strong> {pin.locationFound}</Typography>
            <Typography variant="body2"><strong>Date Found:</strong> {new Date(pin.dateFound).toLocaleDateString()}</Typography>
            <Typography variant="body2"><strong>Time Found:</strong> {pin.timeFound}</Typography>
            
            <Typography variant="h6" sx={{ marginTop: '1.5rem' }}>Inventory</Typography>
            <Typography variant="body2"><strong>Total Owned:</strong> {pin.totalCount}</Typography>
            <Typography variant="body2"><strong>Available for Trade:</strong> {pin.tradeableCount}</Typography>

            <InventoryAlert totalCount={pin.totalCount} />

            {pin.specialCharacteristics.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ marginTop: '1.5rem' }}>Special Characteristics</Typography>
                    <Box>
                        {pin.specialCharacteristics.map(char => <Chip key={char} label={char} sx={{ marginRight: '0.5rem' }}/>)}
                    </Box>
                </>
            )}

            <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={() => router.push(`/pins/${pin.id}/edit`)}>Edit Pin</Button>
                <Button variant="contained" color="secondary" disabled={pin.tradeableCount === 0} sx={{ marginLeft: '1rem' }}>
                    {pin.tradeableCount > 0 ? 'Offer for Trade' : 'Not Tradeable'}
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete} sx={{ marginLeft: '1rem' }}>
                    Delete Pin
                </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
