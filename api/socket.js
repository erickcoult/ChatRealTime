const { Server } = require('socket.io');
const { createServer } = require('http');

// Criando uma instância do servidor HTTP
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://seu-app.vercel.app'] // Substitua pelo seu domínio Vercel
  }
});

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado', socket.id);
  });

  socket.on('set_username', username => {
    socket.data.username = username;
    console.log(socket.data.username);
  });

  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    });
  });
});

// Escutando na porta 3000 (Apenas para ambiente local)
if (process.env.NODE_ENV !== 'production') {
  server.listen(3000, () => console.log('Servidor rodando localmente na porta 3000'));
}

// Exportação necessária para o Vercel
module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.send('Servidor WebSocket está rodando!');
  } else {
    res.status(405).send('Método não permitido');
  }
};
