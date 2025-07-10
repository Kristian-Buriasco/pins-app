'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pin } from '@/types/pin';
import { TextField, Button, Slider, Typography, Box, Chip, Autocomplete } from '@mui/material';
import { useRouter } from 'next/navigation';

interface PinFormProps {
  pin?: Pin;
  onSubmit: (pin: Pin) => void;
  isWishlist?: boolean;
}

const PinForm: React.FC<PinFormProps> = ({ pin, onSubmit, isWishlist }) => {
  const router = useRouter();
  // Accept _id as an optional prop for MongoDB pins
  const mongoId = pin && typeof (pin as unknown as { _id?: string })._id === 'string' ? (pin as unknown as { _id?: string })._id as string : '';
  const [formData, setFormData] = useState<Omit<Pin, 'objectID' | 'transactionHistory'>>({
    id: mongoId || pin?.objectId || pin?.id || '',
    objectId: mongoId || pin?.objectId || '',
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
    totalCount: isWishlist ? 0 : (pin?.totalCount || 1),
    tradeableCount: isWishlist ? 0 : (pin?.tradeableCount || 0),
    type: pin?.type || '',
  });
  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [countryOptions, setCountryOptions] = useState<string[]>(["France", "Italy", "USA", "Germany", "Japan", "UK", "Canada", "China", "Australia", "Spain", "Brazil"]);
  const [eventOptions, setEventOptions] = useState<string[]>(["Olympics", "Paralympics", "World Cup", "Universiade", "WUG Turin 2025", "Paris 2024 Olympics", "Rhine-Ruhr 2025 FISU Games", "Tokyo 2020", "Beijing 2022", "Other"]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>(["Badge", "Plastic", "Enamel", "Other"]);

  useEffect(() => {
    // Fetch unique countries and events from API
    fetch('/api/pins/meta')
      .then(res => res.ok ? res.json() : { countries: [], events: [] })
      .then(data => {
        if (Array.isArray(data.countries)) {
          setCountryOptions(prev => Array.from(new Set([...prev, ...data.countries.filter(Boolean)])));
        }
        if (Array.isArray(data.events)) {
          setEventOptions(prev => Array.from(new Set([...prev, ...data.events.filter(Boolean)])));
        }
        if (Array.isArray(data.categories)) {
          setCategoryOptions(prev => Array.from(new Set([...prev, ...data.categories.filter(Boolean)])));
        }
        if (Array.isArray(data.locations)) {
          setLocationOptions(prev => Array.from(new Set([...prev, ...data.locations.filter(Boolean)])));
        }
        if (Array.isArray(data.types)) {
          setTypeOptions(prev => Array.from(new Set([...prev, ...data.types.filter(Boolean)])));
        }
      });
  }, []);

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

  const handleAddImage = () => {
    if (newImageUrl && !formData.photos.includes(newImageUrl)) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newImageUrl]
      }));
      setNewImageUrl('');
    }
  };

  const handleDeleteImage = (urlToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(url => url !== urlToDelete)
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Only image files are allowed.');
      return;
    }
    setImageUploadError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (!formData.photos.includes(base64)) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, base64]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeableCount = Math.max(0, formData.totalCount - 1);
    const pinToSubmit: Pin = {
      ...formData,
      id: mongoId || pin?.objectId || pin?.id || '',
      objectId: mongoId || pin?.objectId || '',
      transactionHistory: pin?.transactionHistory || [],
      tradeableCount,
    };
    onSubmit(pinToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <TextField name="name" label="Pin Name" value={formData.name} onChange={handleChange} fullWidth required />
        </div>
        <div className="col-span-1 md:col-span-2">
          <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} />
        </div>
        <div>
          <Autocomplete
            freeSolo
            options={categoryOptions}
            value={formData.category}
            onInputChange={(_, newValue) => setFormData(prev => ({ ...prev, category: newValue }))}
            renderInput={(params) => (
              <TextField {...params} name="category" label="Category" fullWidth />
            )}
          />
        </div>
        {!isWishlist && (
          <div>
            <Autocomplete
              freeSolo
              options={locationOptions}
              value={formData.locationFound}
              onInputChange={(_, newValue) => setFormData(prev => ({ ...prev, locationFound: newValue }))}
              renderInput={(params) => (
                <TextField {...params} name="locationFound" label="Location Found" fullWidth />
              )}
            />
          </div>
        )}
        <div>
          <Autocomplete
            freeSolo
            options={countryOptions}
            value={formData.countryOfOrigin}
            onInputChange={(_, newValue) => setFormData(prev => ({ ...prev, countryOfOrigin: newValue }))}
            renderInput={(params) => (
              <TextField {...params} name="countryOfOrigin" label="Country of Origin" fullWidth />
            )}
          />
        </div>
        <div>
          <Autocomplete
            freeSolo
            options={eventOptions}
            value={formData.eventOfOrigin}
            onInputChange={(_, newValue) => setFormData(prev => ({ ...prev, eventOfOrigin: newValue }))}
            renderInput={(params) => (
              <TextField {...params} name="eventOfOrigin" label="Event of Origin" fullWidth />
            )}
          />
        </div>
        {!isWishlist && (
          <div>
            <TextField name="dateFound" label="Date Found" type="date" value={formData.dateFound} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          </div>
        )}
        {!isWishlist && (
          <div>
            <TextField name="timeFound" label="Time Found" type="time" value={formData.timeFound} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          </div>
        )}
        {!isWishlist && (
          <div>
            <TextField name="totalCount" label="Total Quantity" type="number" value={formData.totalCount} onChange={handleChange} fullWidth required InputProps={{ inputProps: { min: 1 } }}/>
          </div>
        )}
        <div>
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
        </div>
        <div className="col-span-1 md:col-span-2">
          <Autocomplete
            freeSolo
            options={typeOptions}
            value={formData.type || ''}
            onInputChange={(_, newValue) => setFormData(prev => ({ ...prev, type: newValue }))}
            renderInput={(params) => (
              <TextField {...params} name="type" label="Type" fullWidth />
            )}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
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
        </div>
        <div className="col-span-1 md:col-span-2">
          <Typography gutterBottom>Images</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Image URL"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddImage()}
              fullWidth
            />
            <Button onClick={handleAddImage}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {imageUploadError && (
              <Typography color="error" variant="body2">{imageUploadError}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            {formData.photos.map(url => (
              <Box key={url} sx={{ position: 'relative', width: 100, height: 100 }}>
                <Image
                  src={url}
                  alt="Pin"
                  fill
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteImage(url)}
                  sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, padding: '2px 6px', fontSize: 10 }}
                >
                  X
                </Button>
              </Box>
            ))}
          </Box>
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
          <Button type="submit" variant="contained" color="primary">{pin ? 'Update' : 'Create'} Pin</Button>
          <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  );
};

export default PinForm;
