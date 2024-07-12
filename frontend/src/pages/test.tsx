/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
export default function Test() {
  const { mutate } = api.post.create.useMutation();
  const session = useSession();
  console.log(session);
  // URL to your strapi instance
  const SERVER_URL = "http://localhost:1337";

  // connect the socket
  const socket = io(SERVER_URL);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  //   const [username, setUsername] = useState("");
  let welcome = {} as {
    user: unknown;
    message: unknown;
  };

  useEffect(() => {
    socket.emit("join", { username: session.data?.user.name }, (error) => {
      //Sending the username to the backend as the user connects.
      if (error) return alert(error);
    });
    socket.on("welcome", async (data, error) => {
      //Getting the welcome message from the backend
      const welcomeMessage = {
        user: data.user,
        message: data.text,
      };
      welcome = welcomeMessage;
      setMessages([welcomeMessage]); //Storing the Welcome Message
      await fetch("http://localhost:1337/api/messages") //Fetching all messages from Strapi
        .then(async (res) => {
          const response = await res.json();
          let arr = [welcome];
          response.data.map((one, i) => {
            arr = [...arr, one.attributes];
            setMessages((msgs) => arr); // Storing all Messages in a state variable
          });
        })
        .catch((e) => console.log(e.message));
    });
    socket.on("message", async (data, error) => {
      //Listening for a message connection
      await fetch("http://localhost:1337/api/messages")
        .then(async (res) => {
          const response = await res.json();
          let arr = [welcome];
          response?.data?.map((one, i) => {
            arr = [...arr, one.attributes];
            setMessages((msgs) => arr);
          });
        })
        .catch((e) => console.log(e.message));
    });
  }, [session.data?.user.name]);
  const sendMessage = (message) => {
    if (message) {
      socket.emit(
        "sendMessage",
        { message, user: session.data?.user.name },
        (error) => {
          // Sending the message to the backend
          if (error) {
            alert(error);
          }
        },
      );
      setMessage("");
    } else {
      alert("Message can't be empty");
    }
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleClick = () => {
    sendMessage(message);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <button
        onClick={() => {
          mutate({
            email: "kuamr@xamtac.com",
            password: "password",
          });
        }}
      >
        Create User
      </button>
      <button
        onClick={() => {
          void signIn("credentials", {
            email: "kuamr@xamtac.com",
            password: "password",
          });
        }}
      >
        {" "}
        sigi{" "}
      </button>
      {JSON.stringify(messages)}

      <input onChange={handleChange} ></input>
      <button onClick={handleClick} >handleClick</button>
    </div>
  );
}
