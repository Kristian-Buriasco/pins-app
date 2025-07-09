'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import PinForm from '@/components/PinForm';
import RequireAuth from '@/components/RequireAuth';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardPageContent />
    </RequireAuth>
  );
}

function DashboardPageContent() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [wishlist, setWishlist] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [wishlistPinDraft, setWishlistPinDraft] = useState<Pin | undefined>(undefined);

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

  const handleOpenAddModal = () => {
    setWishlistPinDraft(undefined);
    setFormError('');
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleWishlistFormSubmit = async (pin: Pin) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pin.name,
          description: pin.description,
          image: pin.photos?.[0] || '',
          category: pin.category,
          countryOfOrigin: pin.countryOfOrigin,
          eventOfOrigin: pin.eventOfOrigin,
        }),
      });
      if (res.ok) {
        const newPin = await res.json();
        setWishlist(prev => [...prev, { ...pin, id: newPin.id, objectId: newPin.objectId }]);
        setSnackbar({ open: true, message: 'Wishlist pin added!' });
        setAddModalOpen(false);
      } else {
        setFormError('Failed to add wishlist pin.');
      }
    } catch {
      setFormError('Failed to add wishlist pin.');
    }
  };

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
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddModal}>
        Add Wishlist Pin
      </Button>
      <Dialog open={addModalOpen} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle>Add Wishlist Pin</DialogTitle>
        <DialogContent>
          <PinForm pin={wishlistPinDraft} onSubmit={handleWishlistFormSubmit} isWishlist={true} />
          {formError && <Typography color="error">{formError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map(pin => (
          <div key={pin.id || pin.objectId}>
            <PinCard pin={pin} />
          </div>
        ))}
      </div>

      <Typography variant="h4" gutterBottom sx={{ marginTop: '2rem' }}>
        All Pins
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pins.map(pin => (
          <div key={pin.id || pin.objectId}>
            <PinCard pin={pin} />
          </div>
        ))}
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}
