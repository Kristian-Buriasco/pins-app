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
const eventKeywords = [
  "rhineruhr2025",
  "rhine-ruhr 2025",
  "rhine ruhr 2025",
  "rhine ruhr games 2025",
  "rhine-ruhr games 2025",
  "rhine ruhr fisu",
  "rhine-ruhr fisu",
  "fisu rhine ruhr",
  "fisu rhine-ruhr",
  "fisu 2025 rhine ruhr",
  "fisu 2025 rhine-ruhr",
  "fisu world university games",
  "fisu world university games 2025",
  "fisu games 2025",
  "fisu 2025",
  "fisu games",
  "fisu",
  "wug 2025",
  "wug rhine ruhr",
  "wug rhine-ruhr",
  "wug germany 2025",
  "world university games",
  "world university games 2025",
  "2025 university games",
  "2025 universiade",
  "universiade 2025",
  "universiade rhine ruhr",
  "universiade rhine-ruhr",
  "universiade germany",
  "universiadi",
  "universiadi 2025",
  "german universiade",
  "germany university games",
  "germany fisu games",
  "germany 2025 university games",
  "university sports games",
  "university sports",
  "games of the universities",
  "2025 university sports",
  "ruhr games",
  "rhine ruhr uni games",
  "rr2025",
  "rr fisu"
];
const filteredPins = pins.filter(pin => {
  const origin = (pin.eventOfOrigin || '').toLowerCase();
  return eventKeywords.some(keyword => origin.includes(keyword));
});

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
