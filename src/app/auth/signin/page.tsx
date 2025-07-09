"use client";
import { signIn } from "next-auth/react";
import { Button, Container, Typography, Box } from "@mui/material";

export default function SignInPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
        <Typography variant="h4" gutterBottom>Sign In</Typography>
        <Button variant="contained" color="primary" onClick={() => signIn("google")}>Sign in with Google</Button>
      </Box>
    </Container>
  );
}
