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
            <strong>1. Acceptance of Terms</strong><br />
            By accessing or using the Pins App (&quot;the App&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;) and all applicable laws and regulations. If you do not agree with any part of these Terms, you must not use the App.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2. Eligibility</strong><br />
            You must be at least 13 years old (or the minimum age required in your jurisdiction) to use the App. By using the App, you represent and warrant that you meet this age requirement.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3. Account Registration and Security</strong><br />
            - You are responsible for creating and maintaining the confidentiality of your account credentials.<br />
            - You agree to provide accurate, current, and complete information during registration and to update it as necessary.<br />
            - You are responsible for all activities that occur under your account.<br />
            - You must notify us immediately of any unauthorized use of your account or any other security breach.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4. Use of the App</strong><br />
            - The App is intended for personal use to track and manage collectible pins.<br />
            - You agree to use the App in compliance with all applicable laws and regulations.<br />
            - You must not use the App for any unlawful or unauthorized purpose.<br />
            - You agree not to interfere with or disrupt the App or servers/networks connected to the App.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>5. Intellectual Property</strong><br />
            - All content, features, and functionality of the App, including but not limited to text, graphics, logos, images, and software, are the exclusive property of Pins App or its licensors.<br />
            - You may not copy, modify, distribute, sell, or lease any part of the App without prior written permission.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6. User Content</strong><br />
            - You retain ownership of the data you input into the App, such as pin information and photos.<br />
            - You grant Pins App a non-exclusive, worldwide, royalty-free license to use, host, store, reproduce, modify, and display your content solely for the purpose of operating and improving the App.<br />
            - You agree not to upload content that is unlawful, harmful, defamatory, or infringes on any third-party rights.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7. Trading and Inventory Rules</strong><br />
            - The App includes features to manage pin inventories and trading.<br />
            - The last pin of any type cannot be traded to prevent accidental loss.<br />
            - Alerts and restrictions on trading are implemented as described in the App.<br />
            - Pins can only be deleted by administrators to correct errors or invalid trades.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>8. Privacy and Data Security</strong><br />
            - Your privacy is important to us. Please review our Privacy Policy for details on data collection, use, and protection.<br />
            - We implement reasonable security measures to protect your data but cannot guarantee absolute security.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>9. Termination and Suspension</strong><br />
            - We reserve the right to suspend or terminate your account and access to the App at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users or the App.<br />
            - Upon termination, your right to use the App will immediately cease.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>10. Disclaimers and Limitation of Liability</strong><br />
            - The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied.<br />
            - Pins App does not guarantee the accuracy, completeness, or reliability of the data or the App’s functionality.<br />
            - To the fullest extent permitted by law, Pins App shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use the App.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>11. Changes to Terms</strong><br />
            - We may update these Terms from time to time.<br />
            - We will notify you of significant changes via the App or email.<br />
            - Continued use of the App after changes constitutes acceptance of the updated Terms.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>12. Governing Law and Dispute Resolution</strong><br />
            - These Terms are governed by and construed in accordance with the laws of the jurisdiction where Pins App is operated.<br />
            - Any disputes arising from these Terms or your use of the App shall be resolved through good faith negotiations. If unresolved, disputes may be subject to binding arbitration or court proceedings as applicable.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13. Contact Information</strong><br />
            If you have any questions about these Terms, please contact us at:<br />
            <strong>Email:</strong> <a href="mailto:Me@kristianburiasco.eu" className="underline text-blue-600">Me@kristianburiasco.eu</a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};