import charts from '../models/chats.js';

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('create chart', async (data) => {
    try {
      const { fromUserId, toUserId, message } = data;

      const result = await charts.create({
        fromUserId,
        toUserId,
        message,
      });

      socket.emit('create chart success', {
        success: true,
        message: '',
      });
    } catch (error) {
      socket.emit('create chart failed', {
        success: false,
        message: error.message,
      });
    }
  });

  socket.on('get chart', async (data) => {
    try {
      const { fromUserId, toUserId } = data;

      const result = await charts
        .find({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        })
        .sort({ createdAt: 1 });

      socket.emit('get chart success', {
        success: true,
        message: '',
        result,
      });
    } catch (error) {
      socket.emit('get chart failed', {
        success: false,
        message: error.message,
      });
    }
  });
});
