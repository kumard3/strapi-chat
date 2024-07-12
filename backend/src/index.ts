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
      //Listening for a connection from the frontend
      socket.on("join", ({ username }) => {

        if (username) {
          socket.join("group"); // Adding the user to the group
          socket.emit("welcome", {
            // Sending a welcome message to the User
            user: "bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });
        } else {
          console.log("An error occurred");
        }
      });
      socket.on("sendMessage", async (data) => {
        // Listening for a sendMessage connection
        let strapiData = {
          // Generating the message data to be stored in Strapi
          data: {
            user: data.user,
            message: data.message,
          },
        };
        var axios = require("axios");
        await axios
          .post("http://localhost:1337/api/messages", strapiData) //Storing the messages in Strapi
          .then((e) => {
            socket.broadcast.to("group").emit("message", {
              //Sending the message to the group
              user: data.username,
              text: data.message,
            });
          })
          .catch((e) => console.log("error", e.message));
      });
    });
  },
};
