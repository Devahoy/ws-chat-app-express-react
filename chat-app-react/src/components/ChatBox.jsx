import ChatFooter from './ChatFooter'

/* eslint-disable react/prop-types */
const ChatBox = ({ messages, lastMessageRef }) => {
  return (
    <>
      <div id="chat-box">
        <div className="chat-box-messages">
          {messages.map((message) => (
            <div className="chat-box-message" key={message.id}>
              <p className="chat-box-meta">
                {message.username} <span>{message.time}</span>
              </p>
              <p className="chat-box-text">{message.message}</p>
              <div ref={lastMessageRef}></div>
            </div>
          ))}
        </div>

        <ChatFooter />
      </div>
    </>
  )
}

export default ChatBox
