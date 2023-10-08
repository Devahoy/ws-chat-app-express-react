import { socket } from './libs/socket'

import './App.css'
import { useEffect, useRef, useState } from 'react'
import ChatSidebar from './components/ChatSidebar'
import ChatBox from './components/ChatBox'
import FriendList from './components/FriendList'

function App() {
  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])

  const lastMessageRef = useRef(null)

  const handleNewMessage = (data) => {
    console.log('received message : ', data)
    setMessages((messages) => [...messages, data])
  }

  const handleRoomConnection = (data) => {
    console.log('received room connection : ', data)
    // always set friends to empty array first
    setFriends(data.users)
  }

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    socket.on('chat:message', handleNewMessage)
    socket.on('chat:room', handleRoomConnection)
  }, [])

  return (
    <div className="chat-container">
      <ChatSidebar />
      <ChatBox messages={messages} lastMessageRef={lastMessageRef} />
      <FriendList friends={friends} />
    </div>
  )
}

export default App
