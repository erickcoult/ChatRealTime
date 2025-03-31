import React, { useRef, useState, useEffect } from 'react'

export default function Chat({ socket }) {
  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    if (!socket) return

    const handleMessageReceive = (data) => {
      setMessageList((current) => [...current, data])
    }

    socket.on('receive_message', handleMessageReceive)

    return () => {
      socket.off('receive_message', handleMessageReceive)
    }
  }, [socket])

  useEffect(() => {
    scrollDown()
  }, [messageList])

  const handleSubmit = () => {
    const message = messageRef.current.value
    if (!message.trim()) return

    socket.emit('message', message)
    clearInput()
  }

  const clearInput = () => {
    messageRef.current.value = ''
  }

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <h1>Chat</h1>
      {messageList.map((message, index) => (
        <p key={index}>
          <strong>{message.author}:</strong> {message.text}
        </p>
      ))}
      <div ref={bottomRef}></div>
      <input type="text" ref={messageRef} placeholder="Mensagem" onKeyDown={getEnterKey} />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  )
}
