'use client';

import React from 'react';
import Link from 'next/link';
import AuthStatus from "@/components/AuthStatus";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Menu } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MenuItem, Box, Fab } from '@mui/material';

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);



  // Handle normal click (short press)
  const handleFabClick = () => {
    router.push('/pins/add');
  };

  // Handle long press
  const handleFabMouseDown = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const timer = setTimeout(() => {
      setAnchorEl(event.currentTarget);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleFabMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddPin = () => {
    router.push('/pins/add');
    handleMenuClose();
  };

  const handleAddWishlist = () => {
    router.push('/wishlist/addWh');
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <nav className="w-full bg-white dark:bg-neutral-900 shadow rounded-b-xl px-4 py-2 flex items-center sticky top-0 z-40 transition-colors">
      {/* Left: Logo/Brand */}
      <div className="flex items-center gap-2 min-w-max">
        <Link href="/" className="text-xl font-bold no-underline text-neutral-800 dark:text-white">Pin Tracker</Link>
      </div>
      {/* Center: Menu */}
      <div className="flex-1 flex justify-center min-w-0">
        <ul className="hidden md:flex gap-2 text-base font-medium">
          <li>
            <Link href="/" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/wishlist" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">Wishlist</Link>
          </li>
          <li>
            <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">Dashboard</Link>
          </li>
          <li>
            <Link href="/users" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">Users</Link>
          </li>
        </ul>
      </div>
      {/* Right: AuthStatus and mobile menu */}
      <div className="flex items-center gap-3 min-w-max">
        <AuthStatus />
        {/* Mobile menu button (optional) */}
        {/* <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800">
          <span className="icon-[tabler--menu-2] size-5"></span>
        </button> */}
      </div>
      {/* Floating Action Button at the bottom right, only if logged in */}
      {session && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleFabClick}
            onMouseDown={handleFabMouseDown}
            onMouseUp={handleFabMouseUp}
            onMouseLeave={handleFabMouseUp}
            onTouchStart={handleFabMouseDown}
            onTouchEnd={handleFabMouseUp}
            onContextMenu={(e) => {
              e.preventDefault();
              setAnchorEl(e.currentTarget);
            }}
          >
            <AddIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClick={handleMenuClose}
          >
            <MenuItem onClick={handleAddPin}>Add Pin</MenuItem>
            <MenuItem onClick={handleAddWishlist}>Add Wishlist</MenuItem>
          </Menu>
        </Box>
      )}
    </nav>
  );
};

export default Navbar;
