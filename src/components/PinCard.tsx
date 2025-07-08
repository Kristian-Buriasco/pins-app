import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { Pin } from '@/types/pin';
import Link from 'next/link';

interface PinCardProps {
  pin: Pin;
}

const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  return (
    <Link href={`/pins/${pin.id}`} passHref style={{ textDecoration: 'none' }}>
      <Card>
        <CardMedia
          component="img"
          height="140"
          image={pin.photos[0] || '/placeholder.png'}
          alt={pin.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pin.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pin.description}
          </Typography>
          <Chip label={pin.category} />
          <Chip label={pin.countryOfOrigin} />
          <Chip label={pin.eventOfOrigin} />
        </CardContent>
      </Card>
    </Link>
  );
};

export default PinCard;
