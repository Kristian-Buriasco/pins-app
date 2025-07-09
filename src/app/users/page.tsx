'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PinCard from '@/components/PinCard';
import { Pin } from '@/types/pin';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPins, setUserPins] = useState<Pin[]>([]);
  const [pinsLoading, setPinsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewPins = async (user: User) => {
    setSelectedUser(user);
    setPinsLoading(true);
    try {
      const res = await fetch(`/api/pins?userId=${user._id}`);
      const data = await res.json();
      setUserPins(data);
    } catch {
      setUserPins([]);
    } finally {
      setPinsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setUserPins([]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        All Users
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {users.map(user => (
            <Paper key={user._id} sx={{ p: 2, minWidth: 250 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleViewPins(user)}>
                View Pins
              </Button>
            </Paper>
          ))}
        </Box>
      )}
      <Dialog open={!!selectedUser} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser?.name}&apos;s Pins</DialogTitle>
        <DialogContent>
          {pinsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" sx={{ mt: 2 }}>
              {userPins.length === 0 ? (
                <Typography>No pins found for this user.</Typography>
              ) : (
                userPins.map(pin => (
                  <div key={pin.id || pin.objectId}>
                    <PinCard pin={pin} />
                  </div>
                ))
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
