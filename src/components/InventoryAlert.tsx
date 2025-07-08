'use client';

import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface InventoryAlertProps {
  totalCount: number;
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ totalCount }) => {
  if (totalCount === 1) {
    return (
      <Alert severity="error" style={{ marginTop: '1rem' }}>
        <AlertTitle>Critical Alert</AlertTitle>
        This is your last pin of this type. Trading is blocked to preserve your collection.
      </Alert>
    );
  }

  if (totalCount === 2) {
    return (
      <Alert severity="warning" style={{ marginTop: '1rem' }}>
        <AlertTitle>Trading Advisory</AlertTitle>
        You only have two pins of this type left. Trading is not recommended.
      </Alert>
    );
  }

  if (totalCount === 3) {
    return (
      <Alert severity="info" style={{ marginTop: '1rem' }}>
        <AlertTitle>Low Stock Warning</AlertTitle>
        You have only three pins of this type remaining.
      </Alert>
    );
  }

  return null;
};

export default InventoryAlert;
