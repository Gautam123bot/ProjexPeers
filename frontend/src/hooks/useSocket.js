import { useEffect, useState } from 'react';
import socket from '../socket';

const useSocket = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      console.log('Connecting socket...');
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('invite:sent', (data) => {
      console.log('Invitation sent:', data);
      setInvitations((prevInvites) => [
        ...prevInvites, 
        { ...data, status: 'Pending' }
      ]);
    });

    socket.on('invite:accepted', (data) => {
      console.log('Invitation accepted:', data);
      setInvitations((prevInvites) =>
        prevInvites.map(invite => 
          invite.senderUserName === data.senderUserName && 
          invite.recipientUserName === data.recipientUserName
            ? { ...invite, status: 'Accepted' } 
            : invite
        )
      );
    });

    socket.on('invite:declined', (data) => {
      console.log('Invitation declined:', data);
      setInvitations((prevInvites) =>
        prevInvites.filter(invite =>
          !(
            invite.senderUserName === data.senderUserName &&
            invite.recipientUserName === data.recipientUserName
          )
        )
      );
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected. Attempting to reconnect...");
      socket.connect(); // Auto-reconnect
    });

    return () => {
      socket.off('invite:sent');
      socket.off('invite:accepted');
      socket.off('invite:declined');
      socket.off("disconnect");
    };
  }, []);

  return invitations;
};

export default useSocket;
