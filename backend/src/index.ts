export default {
  register(/*{ strapi }*/) {},
  bootstrap(/*{ strapi }*/) {
    let io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        // cors setup
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      // Listening for a connection from the frontend
      socket.on("join", ({ username, roomId }) => {
        if (username && roomId) {
          socket.join(roomId); // Adding the user to the specified room
          console.log(`${username} joined room: ${roomId}`);
        } else {
          console.log("An error occurred");
        }
      });

      socket.on("sendMessage", async (data) => {
        // Listening for a sendMessage connection
        let strapiData = {
          // Generating the message data to be stored in Strapi
          data: {
            sender: data.senderId.toString(),
            receiver: data.receiverId.toString(),
            message: data.message,
            user:data.senderName
          },
        };
        var axios = require("axios");
        await axios
          .post("http://localhost:1337/api/messages", strapiData) // Storing the messages in Strapi
          .then((e) => {
            io.to(data.roomId).emit("message",  e.data.data); // Emitting the message to the frontend
          })
          .catch((e) => console.log("error", e.message));
      });
    });
  },
};
