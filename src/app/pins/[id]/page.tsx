'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Chip, Box, Button, CircularProgress } from '@mui/material';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import InventoryAlert from '@/components/InventoryAlert';
import { Pin } from '@/types/pin';

export default function PinDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pin? This action cannot be undone.')) {
      try {
        const pinId = (pin && ((pin as { _id?: string })._id || pin.objectId || pin.id)) || '';
        if (!pinId) {
          alert('Invalid pin ID');
          return;
        }
        const response = await fetch(`/api/pins/${pinId}`, {
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

  const handleTrade = async (type: 'trade' | 'receive') => {
    if (!pin) return;
    let newTotal = pin.totalCount;
    let newTradeable = pin.tradeableCount;
    if (type === 'trade' && pin.tradeableCount > 0) {
      newTotal -= 1;
      newTradeable -= 1;
    } else if (type === 'receive') {
      newTotal += 1;
      newTradeable += 1;
    } else {
      return;
    }
    const transaction = {
      date: new Date().toISOString(),
      description: type === 'trade' ? 'Traded away a pin' : 'Received a pin',
    };
    const updatedPin = {
      ...pin,
      totalCount: newTotal,
      tradeableCount: newTradeable,
      transactionHistory: [...(pin.transactionHistory || []), transaction],
    };
    try {
      const pinId = (pin && ((pin as { _id?: string })._id || pin.objectId || pin.id)) || '';
      if (!pinId) {
        alert('Invalid pin ID');
        return;
      }
      const response = await fetch(`/api/pins/${pinId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPin),
      });
      if (response.ok) {
        setPin(updatedPin);
      } else {
        alert('Failed to update pin after trade.');
      }
    } catch {
      alert('Error updating pin.');
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
                src={pin.photos[0] || '/placeholder.png'}
                alt={pin.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
            {pin.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {pin.photos.map((photo, index) => (
                  <div key={index}>
                     <Box sx={{ position: 'relative', width: '100%', height: '80px' }}>
                        <Image
                            src={photo}
                            alt={`${pin.name} thumbnail ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                     </Box>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
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
                <Button variant="contained" color="primary" onClick={() => router.push(`/pins/${(pin && ((pin as { _id?: string })._id || pin.objectId || pin.id)) || ''}/edit`)}>Edit Pin</Button>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={pin.tradeableCount === 0}
                  sx={{ marginLeft: '1rem' }}
                  onClick={() => handleTrade('trade')}
                >
                  {pin.tradeableCount > 0 ? 'Trade Away' : 'Not Tradeable'}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginLeft: '1rem' }}
                  onClick={() => handleTrade('receive')}
                >
                  Receive Pin
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete} sx={{ marginLeft: '1rem' }}>
                    Delete Pin
                </Button>
            </Box>
            {pin.transactionHistory && pin.transactionHistory.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Transaction History</Typography>
                <ul>
                  {pin.transactionHistory.map((t, i) => (
                    <li key={i}>
                      {new Date(t.date).toLocaleString()} - {t.description}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </div>
        </div>
      </Paper>
    </Container>
  );
}
