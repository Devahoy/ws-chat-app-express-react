import express from 'express'
import { nanoid } from 'nanoid'

import { createServer } from 'node:http'
import { Server } from 'socket.io'

// mock db, ใช้เก็บข้อมูล user ที่ login เข้ามา
const users = []

const app = express()

// 1. สร้าง `server` ด้วย `app` โดยใช้ `createServer` จาก `node:http`
const server = createServer(app)

// 2. สร้าง `io` โดยใช้ `new Server` จาก `socket.io`
// 3 ทำการ enable cors เนื่องจาก client และ server คนละ port กัน
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

io.on('connection', (socket) => {
  console.log('a user connected')

  const index = users.findIndex((user) => user.id === socket.id)
  if (index === -1) {
    users.push({
      id: socket.id,
      name: socket.id,
      status: 'online',
    })
  }

  io.emit('chat:room', {
    type: 'join',
    message: `user ${socket.id} connected`,
    users,
  })

  socket.on('chat:message', (msg) => {
    console.log('message: ' + JSON.stringify(msg))

    io.emit('chat:message', {
      ...msg,
      id: socket.id + new Date().getTime(),
    })
    socket.broadcast.emit('chat:typing', { isTyping: false })
  })

  socket.on('chat:typing', (msg) => {
    console.log('typing: ' + JSON.stringify(msg))

    // ส่งข้อความไปหา client ทุกคน ยกเว้นตัวผู้ส่ง (sender)
    socket.broadcast.emit('chat:typing', msg)
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`)

    // ลบ user ที่ออกจากการเชื่อมต่อออกจาก array
    const index = users.findIndex((user) => user.id === socket.id)
    users.splice(index, 1)

    io.emit('chat:room', {
      type: 'leave',
      message: `user ${socket.id} disconnected`,
      users,
    })
  })
})

const APP_PORT = 5555

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

// 4. เปลี่ยน `app.listen` เป็น `server.listen`
server.listen(APP_PORT, () => {
  console.log(`App running on port ${APP_PORT}`)
})
