"use client";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button, Box, Typography, Menu, MenuItem, IconButton, Avatar } from "@mui/material";
// import Image from "next/image";
import React, { useState } from "react";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <Button color="inherit" onClick={() => signIn()}>Sign In</Button>
    );
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
        <Avatar src={session.user?.image || "/default-avatar.png"} alt={session.user?.name || "User"} sx={{ width: 40, height: 40 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={session.user?.image || "/default-avatar.png"} alt={session.user?.name || "User"} sx={{ width: 28, height: 28 }} />
            <Typography variant="body2">{session.user?.name}</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
      </Menu>
    </>
  );
}
