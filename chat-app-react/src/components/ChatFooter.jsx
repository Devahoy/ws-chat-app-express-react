import { useEffect, useState } from 'react'
import { socket } from '../libs/socket'

const ChatFooter = () => {
  const [name, setName] = useState(getName())
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    socket.on('chat:typing', (data) => {
      setIsTyping(data.isTyping)
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message) return

    const payload = {
      username: name,
      message,
      time: new Date().toLocaleDateString(),
    }

    socket.emit('chat:message', payload)

    setMessage('')
  }

  function getName() {
    // get name from date timestamp
    const date = new Date()
    return 'User-' + date.getTime()
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'name') {
      setName(value)
    } else if (name === 'message') {
      setMessage(value)

      const _isTyping = value !== ''
      socket.emit('chat:typing', { username: name, isTyping: _isTyping })
    }
  }

  return (
    <>
      {isTyping && (
        <span style={{ marginLeft: '1.5rem' }}>มีคนกำลังพิมพ์อยู่...</span>
      )}

      <form className="chat-footer" onSubmit={handleSubmit}>
        <input type="text" name="name" value={name} onChange={handleChange} />
        <input
          id="message"
          type="text"
          name="message"
          value={message}
          onChange={handleChange}
        />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default ChatFooter
