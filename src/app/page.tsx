'use client';

import { useState, useEffect } from 'react';
import { Pin } from '@/types/pin';
import PinCard from '@/components/PinCard';
import { Container, TextField, Box, Typography } from '@mui/material';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredPins.map((pin) => (
            <div key={pin.id}>
              <PinCard pin={pin} />
            </div>
          ))}
        </div>
      </Box>
    </Container>
  );
}
