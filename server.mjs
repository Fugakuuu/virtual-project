import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3001", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join overlay room based on userId
    socket.on("join-overlay", (userId) => {
      if (!userId) return;
      console.log(`User ${userId} joined their overlay room`);
      socket.join(`user-${userId}`);
    });

    // Handle asset trigger from dashboard
    socket.on("trigger-asset", (data) => {
      const { userId } = data;
      if (!userId) return;
      
      console.log(`[TRIGGER] Asset: ${data.name} | User: ${userId}`);
      
      // Emit to the specific user's overlay room
      io.to(`user-${userId}`).emit("play-asset", data);
    });

    // Handle stop all from dashboard (if implemented)
    socket.on("stop-all", (userId) => {
      if (!userId) return;
      console.log(`[STOP] Stop all assets for User: ${userId}`);
      io.to(`user-${userId}`).emit("stop-all");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io server is active and integrated`);
  });
});
