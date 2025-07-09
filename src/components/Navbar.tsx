'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            Pin Tracker
          </Link>
        </Typography>
        <Box>
          <Link href="/" passHref>
            <Button color="inherit">Home</Button>
          </Link>
          <Link href="/wishlist" passHref>
            <Button color="inherit">Wishlist</Button>
          </Link>
          <Link href="/pins" passHref>
            <Button color="inherit">Pins</Button>
          </Link>
          <Link href="/pins/add" passHref>
            <Button color="inherit">Add Pin</Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button color="inherit">Dashboard</Button>
          </Link>
          <Link href="/users" passHref>
            <Button color="inherit">Users</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
