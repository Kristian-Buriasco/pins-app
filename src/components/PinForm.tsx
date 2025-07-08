'use client';

import React, { useState } from 'react';
import { Pin } from '@/types/pin';
import { TextField, Button, Grid, Slider, Typography, Box, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

interface PinFormProps {
  pin?: Pin;
  onSubmit: (pin: Pin) => void;
}

const PinForm: React.FC<PinFormProps> = ({ pin, onSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Pin, 'id' | 'transactionHistory'>>({
    name: pin?.name || '',
    description: pin?.description || '',
    photos: pin?.photos || [],
    locationFound: pin?.locationFound || '',
    category: pin?.category || '',
    countryOfOrigin: pin?.countryOfOrigin || '',
    eventOfOrigin: pin?.eventOfOrigin || '',
    value: pin?.value || 5,
    dateFound: pin?.dateFound || '',
    timeFound: pin?.timeFound || '',
    specialCharacteristics: pin?.specialCharacteristics || [],
    totalCount: pin?.totalCount || 1,
    tradeableCount: pin?.tradeableCount || 0,
  });
  const [newCharacteristic, setNewCharacteristic] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFormData(prev => ({ ...prev, value: newValue as number }));
  };
  
  const handleAddCharacteristic = () => {
    if (newCharacteristic && !formData.specialCharacteristics.includes(newCharacteristic)) {
        setFormData(prev => ({
            ...prev,
            specialCharacteristics: [...prev.specialCharacteristics, newCharacteristic]
        }));
        setNewCharacteristic('');
    }
  };

  const handleDeleteCharacteristic = (charToDelete: string) => {
    setFormData(prev => ({
        ...prev,
        specialCharacteristics: formData.specialCharacteristics.filter(char => char !== charToDelete)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeableCount = Math.max(0, formData.totalCount - 1);
    const pinToSubmit: Pin = {
      ...formData,
      id: pin?.id || new Date().toISOString(),
      transactionHistory: pin?.transactionHistory || [],
      tradeableCount,
    };
    onSubmit(pinToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField name="name" label="Pin Name" value={formData.name} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="category" label="Category" value={formData.category} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="locationFound" label="Location Found" value={formData.locationFound} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="countryOfOrigin" label="Country of Origin" value={formData.countryOfOrigin} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="eventOfOrigin" label="Event of Origin" value={formData.eventOfOrigin} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="dateFound" label="Date Found" type="date" value={formData.dateFound} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="timeFound" label="Time Found" type="time" value={formData.timeFound} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="totalCount" label="Total Quantity" type="number" value={formData.totalCount} onChange={handleChange} fullWidth required InputProps={{ inputProps: { min: 1 } }}/>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Value ({formData.value})</Typography>
            <Slider
                value={formData.value}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
            />
        </Grid>
        <Grid item xs={12}>
            <Typography gutterBottom>Special Characteristics</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField 
                    label="Add a characteristic" 
                    value={newCharacteristic} 
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCharacteristic()}
                />
                <Button onClick={handleAddCharacteristic}>Add</Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.specialCharacteristics.map(char => (
                    <Chip key={char} label={char} onDelete={() => handleDeleteCharacteristic(char)} />
                ))}
            </Box>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">{pin ? 'Update' : 'Create'} Pin</Button>
          <Button variant="outlined" onClick={() => router.back()} style={{ marginLeft: '1rem' }}>Cancel</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PinForm;
