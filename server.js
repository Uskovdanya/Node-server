const net = require("net");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection to the server");

  const clientId = clients.length + 1;
  //Broadcasting a message to evereyone when someone joined
  clients.map((client) => {
    client.socket.write(`User id-${clientId} joined`);
  });
  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    //console.log(data.toString("utf-8"));
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    clients.map((client) => {
      client.socket.write(`> User ${id} : ${message}`);
    });
  });

  //Broadcasting a message to evereyone when someone left
  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`User id-${clientId} left`);
    });
  });

  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
}); // процесс connection будет запускаться каждый раз как кто то будет подключаться к нашему серверу

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on", server.address());
});
