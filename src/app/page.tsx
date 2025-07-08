'use client';

import { useState, useEffect } from 'react';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import { Container, Grid, TextField, Box, Typography } from '@mui/material';

export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [filteredPins, setFilteredPins] = useState<Pin[]>([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  useEffect(() => {
    const fetchPins = async () => {
      const response = await fetch('/api/pins');
      const data = await response.json();
      setPins(data);
      setFilteredPins(data);
    };
    fetchPins();
  }, []);

  useEffect(() => {
    let filtered = pins;
    if (countryFilter) {
      filtered = filtered.filter((pin) =>
        pin.countryOfOrigin.toLowerCase().includes(countryFilter.toLowerCase())
      );
    }
    if (eventFilter) {
      filtered = filtered.filter((pin) =>
        pin.eventOfOrigin.toLowerCase().includes(eventFilter.toLowerCase())
      );
    }
    setFilteredPins(filtered);
  }, [pins, countryFilter, eventFilter]);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pin Collection
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Filter by country"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Filter by event"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {filteredPins.map((pin) => (
            <Grid item xs={12} sm={6} md={4} key={pin.id}>
              <PinCard pin={pin} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
