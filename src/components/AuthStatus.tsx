"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box, Typography } from "@mui/material";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Typography>Loading authentication...</Typography>;
  }

  if (!session) {
    return (
      <Box>
        <Button color="inherit" onClick={() => signIn()}>Sign In</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="body2">Signed in as {session.user?.email}</Typography>
      <Button color="inherit" onClick={() => signOut()}>Sign Out</Button>
    </Box>
  );
}
