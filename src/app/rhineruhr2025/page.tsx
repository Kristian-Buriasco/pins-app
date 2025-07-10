"use client";

import { useState, useEffect } from 'react';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import { Container, Box, Typography, Snackbar } from '@mui/material';
import RequireAuth from '@/components/RequireAuth';

export default function RhineRuhr2025Page() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

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

  // Filter pins for Rhine-Ruhr 2025 FISU Games
  const filteredPins = pins.filter(
    pin => (pin.eventOfOrigin || '').toLowerCase().includes('rhineruhr2025') ||
           (pin.eventOfOrigin || '').toLowerCase().includes('rhine ruhr 2025') ||
           (pin.eventOfOrigin || '').toLowerCase().includes('fisu games')
  );

  return (
    <RequireAuth>
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Rhine-Ruhr 2025 FISU Games Pins
          </Typography>
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
