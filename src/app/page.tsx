'use client';

import { useState, useEffect } from 'react';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import PinForm from '@/components/PinForm';
import { Container, TextField, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Autocomplete } from '@mui/material';
import RequireAuth from '@/components/RequireAuth';

export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [countryFilter, setCountryFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [PinDraft, setPinDraft] = useState<Pin | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setPinDraft(null);
    setFormError(null);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handlePinFormSubmit = () => {
    // Add logic to handle form submission
    setAddModalOpen(false);
    setSnackbar({ open: true, message: 'Pin submitted (not yet saved to backend).' });
  };

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await fetch('/api/pins');
        if (!res.ok) throw new Error('Failed to load pins');
        const data = await res.json();
        setPins(data);
      } catch {
        setSnackbar({ open: true, message: 'Failed to load pins.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, []);

  // Get unique country and event options for autocomplete
  const countryOptions = Array.from(new Set(pins.map(pin => pin.countryOfOrigin).filter(Boolean))).sort();
  const eventOptions = Array.from(new Set(pins.map(pin => pin.eventOfOrigin).filter(Boolean))).sort();

  const filteredPins = pins.filter(pin => {
    const countryMatch = countryFilter.trim() === '' || (pin.countryOfOrigin || '').toLowerCase().includes(countryFilter.trim().toLowerCase());
    const eventMatch = eventFilter.trim() === '' || (pin.eventOfOrigin || '').toLowerCase().includes(eventFilter.trim().toLowerCase());
    return countryMatch && eventMatch;
  });

  return (
    <RequireAuth>
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Pin Collection
          </Typography>
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddModal}>
            Add Pin
          </Button>
          <Dialog open={addModalOpen} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
            <DialogTitle>Add Pin</DialogTitle>
            <DialogContent>
              <PinForm pin={PinDraft || undefined} onSubmit={handlePinFormSubmit} isWishlist={false} />
              {formError && <Typography color="error">{formError}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddModal}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <Autocomplete
                freeSolo
                options={countryOptions}
                value={countryFilter}
                onInputChange={(_, newValue) => setCountryFilter(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by country" fullWidth />
                )}
              />
            </div>
            <div>
              <Autocomplete
                freeSolo
                options={eventOptions}
                value={eventFilter}
                onInputChange={(_, newValue) => setEventFilter(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by event" fullWidth />
                )}
              />
            </div>
          </div>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredPins.map((pin) => (
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
        </Box>
      </Container>
    </RequireAuth>
  );
}
