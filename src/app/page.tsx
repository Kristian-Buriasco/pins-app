'use client';

import { useState, useEffect } from 'react';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import PinForm from '@/components/PinForm';
import { Container, TextField, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Autocomplete, Slider } from '@mui/material';
import RequireAuth from '@/components/RequireAuth';


export default function Home() {


  // PWA install prompt state
  // Define BeforeInstallPromptEvent type
  type BeforeInstallPromptEvent = Event & {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  };
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPwaPopup, setShowPwaPopup] = useState(false);

  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [countryFilter, setCountryFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [valueRange, setValueRange] = useState<[number, number]>([1, 10]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [PinDraft, setPinDraft] = useState<Pin | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
    // Listen for PWA install prompt
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaPopup(true);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        // Fetch all pins (not just current user)
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
    const valueMatch = pin.value >= valueRange[0] && pin.value <= valueRange[1];
    const searchMatch = search.trim() === '' ||
      (pin.name && pin.name.toLowerCase().includes(search.trim().toLowerCase())) ||
      (pin.description && pin.description.toLowerCase().includes(search.trim().toLowerCase())) ||
      (pin.category && pin.category.toLowerCase().includes(search.trim().toLowerCase()))
      || (pin.countryOfOrigin && pin.countryOfOrigin.toLowerCase().includes(search.trim().toLowerCase())) ||
      (pin.eventOfOrigin && pin.eventOfOrigin.toLowerCase().includes(search.trim().toLowerCase())) ||
      (pin.locationFound && pin.locationFound.toLowerCase().includes(search.trim().toLowerCase())) || 
      (pin.specialCharacteristics && pin.specialCharacteristics.toString().toLowerCase().includes(search.trim().toLowerCase()));
    return countryMatch && eventMatch && valueMatch && searchMatch;
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

          {/* PWA Install Popup */}
          {showPwaPopup && (
            <Box sx={{
              position: 'fixed',
              bottom: 32,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 2000,
            }}>
              <Box sx={{
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 3,
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Typography variant="body1">Install this app for the best experience!</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') setShowPwaPopup(false);
                    }
                  }}
                >
                  Add to Home Screen
                </Button>
                <Button onClick={() => setShowPwaPopup(false)} size="small">Dismiss</Button>
              </Box>
            </Box>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            <div>
              <Box sx={{ px: 1 }}>
                <Typography gutterBottom>Value Range</Typography>
                <Slider
                  value={valueRange}
                  onChange={(_, newValue) => setValueRange(newValue as [number, number])}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>{valueRange[0]}</span>
                  <span>{valueRange[1]}</span>
                </Box>
              </Box>
            </div>
            <div>
              <TextField
                fullWidth
                label="Search pins"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 xl:gap-16">
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
