import React, { useEffect, useState } from "react";
import "./Chat.css";
import { IconButton, Avatar } from "@material-ui/core";
import { SearchOutlined, AttachFile, MoreVert } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "../axios.js";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
import { useStateValue } from "../StateProvider";
import moment from "moment";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post("/message/new", {
      message: input,
      name: user.displayName,
      timestamp: new Date(),
      received: false,
      roomId: roomId,
    });
    setInput("");
  };

  useEffect(() => {
    if (roomId) {
      axios.get(`/rooms/sync/${roomId}`).then((response) => {
        setRoomName(response.data.name);
        axios.get("/messages/sync").then((response) => {
          setMessages(response.data.filter((msg) => msg.roomId == roomId));
        });
      });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    const pusher = new Pusher("2cb6ce6c7e4396a5ec14", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);


  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {moment(messages[messages.length - 1]?.timestamp).format(
              "DD MMM YYYY"
            ) === moment(new Date()).format("DD MMM YYYY")
              ? "today" +
                " " +
                " at " +
                moment(messages[messages.length - 1]?.timestamp).format("h:m a")
              : moment(messages[messages.length - 1]?.timestamp).format(
                  "DD MMM YYYY h:m a"
                )}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_receiver"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">
              {moment(message.timestamp).format("h:m a")}
            </span>
          </p>
        ))}
      </div>

      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYpe a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
