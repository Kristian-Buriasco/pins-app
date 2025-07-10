import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { Pin } from '@/types/pin';
import Link from 'next/link';

interface PinCardProps {
  pin: Pin;
}

const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  // Use _id (from MongoDB) for navigation, fallback to objectId/id for legacy data
  const pinId = (pin as { _id?: string })._id || pin.objectId || pin.id;
  return (
    <div
      style={{ position: 'relative' }}
      className="sm:!w-auto w-full max-w-xs mx-auto"
    >
      <Link href={`/pins/${pinId}`} passHref style={{ textDecoration: 'none' }}>
        <Card
          className="transition-all"
          sx={{
            width: { xs: 220, sm: 300 },
            minWidth: { xs: 180, sm: 250 },
            mx: 'auto',
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: { xs: 100, sm: 140 } }}
            image={pin.photos[0] || '/placeholder.png'}
            alt={pin.name}
          />
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {pin.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              {pin.description}
            </Typography>
            <Chip label={pin.category} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
            <Chip label={pin.countryOfOrigin} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
            <Chip label={pin.eventOfOrigin} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default PinCard;
