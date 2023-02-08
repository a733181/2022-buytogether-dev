import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import userRoute from './routes/users.js';
import productRouter from './routes/products.js';
import orderRouter from './routes/orders.js';
import messageRouter from './routes/messages.js';
import contactRouter from './routes/contacts.js';
import reportRouter from './routes/reports.js';
import chats from './models/chats.js';

import './passport/passport.js';

mongoose.connect(process.env.DB_URL);
mongoose.set('sanitizeFilter', true);

const app = express();

// 跨域請求設定
app.use(
  cors({
    origin(origin, callback) {
      if (
        origin === undefined ||
        origin.includes('github') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error(), false);
      }
    },
  }),
);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' });
});

app.use(express.json());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' });
});

app.use('/users', userRoute);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/messages', messageRouter);
app.use('/contacts', contactRouter);
app.use('/reports', reportRouter);

app.all('*', (req, res) => {
  res.status(400).json({ success: false, message: '找不到' });
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log('Server started');
});

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (
        origin === undefined ||
        origin.includes('github') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error(), false);
      }
    },
  },
});

io.on('connection', (socket = Socket) => {
  console.log('User connected');

  socket.on('sendMessage', async (data) => {
    const { fromUserId, toUserId, message } = data;
    const newMessage = new chats({ fromUserId, toUserId, message });
    await newMessage.save();
    socket.broadcast.emit('newMessage', newMessage);
  });

  socket.on('getMessage', async (data) => {
    const { fromUserId, toUserId } = data;
    const messages = await chats
      .find({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })
      .sort({ createdAt: 1 });
    socket.emit('messages', messages);
  });
});
