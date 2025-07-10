"use client";

import { Container, Box, Typography, Paper } from '@mui/material';

export default function TermsOfServicePage() {
  return (
    <Container maxWidth="md" sx={{ my: 6 }}>
      <Box>
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using Pins App, you agree to comply with these terms and conditions. You are responsible for keeping your account credentials secure and for all activities that occur under your account.
          </Typography>
          <Typography variant="body1" paragraph>
            Pins App is provided on an “as is” and “as available” basis. We may update, modify, or discontinue any part of the service at any time, with or without notice. We are not liable for any loss or inconvenience caused by such changes.
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to misuse the app, attempt unauthorized access, or engage in any activity that could harm the service or other users. Violations of these terms may result in suspension or termination of your account.
          </Typography>
          <Typography variant="body1" paragraph>
            For complete details, please refer to our full Terms of Service at the link provided in the app. If you have any questions or need assistance, contact us at <a href="mailto:Me@kristianburiasco.eu" className="underline text-blue-600">Me@kristianburiasco.eu</a>.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
