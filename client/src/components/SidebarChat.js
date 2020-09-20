import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import axios from "../axios.js";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const createChat = () => {
    const roomName = prompt("Please enter name for chat room");
    if (roomName) {
      axios.post("/rooms/new", {
        name: roomName,
      });
    }
  };

  useEffect(() => {
    if (id) {
      //get messages by room id
      axios.get("/messages/sync").then((response) => {
        setMessages(response.data.filter((msg) => msg.roomId === id));
      });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);


  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          <p>{messages[messages.length - 1]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
