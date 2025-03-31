import React, { useRef } from 'react'
import io from 'socket.io-client'

export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef()

  const handleSubmit = async () => {
    const username = usernameRef.current.value
    if (!username.trim()) return

    const socket = await io.connect('https://chat-real-time-xi.vercel.app')
    socket.emit('set_username', username)
    setSocket(socket)
    
    socket.on('connect', () => {
      console.log('Conectado ao servidor com ID:', socket.id);
    })

    setChatVisibility(true)
  }

  return (
    <div>
      <h1>Join</h1>
      <input type="text" ref={usernameRef} placeholder='Digite seu Nome' />
      <button onClick={() => handleSubmit()}>Entrar</button>
    </div>
  )
}
