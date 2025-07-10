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


  // Handle long press (fix: use ref to store timer, and handle both mouse and touch events robustly)
  const fabButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleFabMouseDown = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // For touch events, event.currentTarget is not always reliable, so use a ref
    const target = fabButtonRef.current || event.currentTarget;
    const timer = setTimeout(() => {
      setAnchorEl(target);
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

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Hamburger Icon for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-800 dark:text-white"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
            <div className="w-64 bg-white dark:bg-neutral-900 h-full shadow-lg flex flex-col p-6">
              <button
                className="self-end mb-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-800 dark:text-white"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <nav className="flex flex-col gap-4">
                <button className="text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-base font-medium" onClick={() => {router.push('/'); setMobileMenuOpen(false);}}>Home</button>
                <button className="text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-base font-medium" onClick={() => {router.push('/wishlist'); setMobileMenuOpen(false);}}>Wishlist</button>
                <button className="text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-base font-medium" onClick={() => {router.push('/dashboard'); setMobileMenuOpen(false);}}>Dashboard</button>
                <button className="text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-base font-medium" onClick={() => {router.push('/users'); setMobileMenuOpen(false);}}>Users</button>
              </nav>
            </div>
          </div>
        )}
      </div>
      {/* Right: AuthStatus and mobile menu */}
      <div className="flex items-center gap-3 min-w-max">
        <AuthStatus />
      </div>
      {/* Floating Action Button at the bottom right, only if logged in */}
      {session && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
          <Fab
            ref={fabButtonRef}
            color="primary"
            aria-label="add"
            onClick={handleFabClick}
            onMouseDown={handleFabMouseDown}
            onMouseUp={handleFabMouseUp}
            onMouseLeave={handleFabMouseUp}
            onTouchStart={handleFabMouseDown}
            onTouchEnd={handleFabMouseUp}
            onTouchCancel={handleFabMouseUp}
            onContextMenu={(e) => {
              e.preventDefault();
              setAnchorEl(fabButtonRef.current || e.currentTarget);
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
