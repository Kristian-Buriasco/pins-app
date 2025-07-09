'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Box, TextField } from '@mui/material';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import PinForm from '@/components/PinForm';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [wishlistPinDraft, setWishlistPinDraft] = useState<Pin | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [countryFilter, setCountryFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json();
        setWishlist(data);
      } catch {
        setSnackbar({ open: true, message: 'Failed to load wishlist.' });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
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

  const filteredWishlist = wishlist.filter(pin => {
    const countryMatch = countryFilter.trim() === '' || (pin.countryOfOrigin || '').toLowerCase().includes(countryFilter.trim().toLowerCase());
    const eventMatch = eventFilter.trim() === '' || (pin.eventOfOrigin || '').toLowerCase().includes(eventFilter.trim().toLowerCase());
    return countryMatch && eventMatch;
  });

  return (
    <Container>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <TextField
            fullWidth
            label="Filter by country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            label="Filter by event"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredWishlist.map(pin => (
            <div key={pin.id || pin.objectId}>
              <PinCard pin={pin} />
            </div>
          ))}
        </div>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}
