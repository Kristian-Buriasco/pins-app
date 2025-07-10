"use client";

import { Container, Box, Typography, Paper } from '@mui/material';

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ my: 6 }}>
      <Box>
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Pins App values your privacy and is committed to safeguarding your personal information. We collect and use only the data necessary to provide and improve our services, such as your account details, pin collection records, and user preferences.
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell or share your personal data with third parties, except as required to deliver essential app features (for example, authentication through Google OAuth) or when required by law. Your information is stored securely, and you have the right to request deletion of your data at any time.
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to enhance your experience, remember your settings, and analyze how the app is used. We do not use your data for advertising or marketing purposes.
          </Typography>
          <Typography variant="body1" paragraph>
            You are always in control of your information. If you have questions, concerns, or would like to access or delete your data, please contact us at <a href="mailto:Me@kristianburiasco.eu" className="underline text-blue-600">Me@kristianburiasco.eu</a>.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
