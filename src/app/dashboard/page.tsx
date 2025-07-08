'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';

export default function DashboardPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [wishlist, setWishlist] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pinsResponse, wishlistResponse] = await Promise.all([
          fetch('/api/pins'),
          fetch('/api/wishlist'),
        ]);
        const pinsData = await pinsResponse.json();
        const wishlistData = await wishlistResponse.json();
        setPins(pinsData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Container><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Container>;
  }

  const dashboardData = pins.map(pin => ({
    name: pin.name,
    trades: pin.transactionHistory.length,
  }));

  const totalPins = pins.reduce((sum, pin) => sum + pin.totalCount, 0);
  const uniquePins = pins.length;

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>
        Analytics Dashboard
      </Typography>
      
      <Paper sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h6">Collection Summary</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <Typography variant="h5">{totalPins}</Typography>
            <Typography color="text.secondary">Total Pins</Typography>
          </div>
          <div>
            <Typography variant="h5">{uniquePins}</Typography>
            <Typography color="text.secondary">Unique Pins</Typography>
          </div>
        </div>
      </Paper>

      <Paper sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h6">Most Traded Pins</Typography>
        <Box sx={{ height: 300, marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="trades" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>
        My Wishlist
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map(pin => (
          <div key={pin.id}>
            <PinCard pin={pin} />
          </div>
        ))}
      </div>
    </Container>
  );
}
