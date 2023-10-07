import path from 'path'
import { fileURLToPath } from 'url'

import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express()

// 1. สร้าง `server` ด้วย `app` โดยใช้ `createServer` จาก `node:http`
const server = createServer(app)

// 2. สร้าง `io` โดยใช้ `new Server` จาก `socket.io`
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('chat:message', (msg) => {
    console.log('message: ' + JSON.stringify(msg))

    io.emit('chat:message', msg)
  })
})

const APP_PORT = 5555

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

// 4. เปลี่ยน `app.listen` เป็น `server.listen`
server.listen(APP_PORT, () => {
  console.log(`App running on port ${APP_PORT}`)
})
