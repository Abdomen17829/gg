import { Server } from 'socket.io';
import Message from '../models/Message';
import { authenticateSocket } from '../middleware/socketAuth';

interface AuthenticatedSocket {
  user?: any;
}

export const setupSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.user?.userId);

    if (socket.user) {
      socket.join(`user:${socket.user.userId}`);
    }

    socket.join('global');

    const loadPreviousMessages = async () => {
      try {
        const messages = await Message.find({ conversation: 'global' })
          .populate('author', 'name avatarUrl')
          .sort({ createdAt: -1 })
          .limit(50)
          .exec();

        socket.emit('previousMessages', messages.reverse().map(msg => ({
          id: msg._id,
          text: msg.text,
          author: {
            id: msg.author._id,
            name: msg.author.name,
            avatarUrl: msg.author.avatarUrl
          },
          timestamp: msg.createdAt
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    loadPreviousMessages();

    socket.on('sendMessage', async (data) => {
      try {
        if (!socket.user) {
          socket.emit('error', 'Authentication required');
          return;
        }

        if (!data.text || data.text.trim() === '') {
          socket.emit('error', 'Message cannot be empty');
          return;
        }

        const message = new Message({
          text: data.text.trim(),
          author: socket.user.userId,
          conversation: 'global'
        });

        await message.save();
        await message.populate('author', 'name avatarUrl');

        io.to('global').emit('message', {
          id: message._id,
          text: message.text,
          author: {
            id: message.author._id,
            name: message.author.name,
            avatarUrl: message.author.avatarUrl
          },
          timestamp: message.createdAt
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('requestPreviousMessages', loadPreviousMessages);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user?.userId);
    });
  });
};