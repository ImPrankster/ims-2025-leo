const myId = crypto.randomUUID();

const socket = io("ws://localhost:3005", {
  withCredentials: true,
});

socket.on("update_map", (data) => {
  const d = JSON.parse(data);
  delete d[myId];
  setPoses(Object.values(d).map((v) => JSON.parse(v)));
});

function sendJSON(obj) {
  socket.emit("send_figure", JSON.stringify([myId, JSON.stringify(obj)]));
}
