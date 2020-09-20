import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { IconButton, Avatar } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import axios from '../axios.js';
import Pusher from "pusher-js";
import { useStateValue } from "../StateProvider";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{user}, dispatch] = useStateValue();

  useEffect(()=> {
   const unsubscribe = axios.get('/rooms/sync')
    .then(response=>{
      setRooms(response.data);
    });

    return () => {
      unsubscribe();
    }
  }, []);

useEffect(() => {
  const pusher = new Pusher('2cb6ce6c7e4396a5ec14', {
    cluster: 'eu'
  });

  const channel = pusher.subscribe('room');
  channel.bind('inserted', (newRoom) => {
    setRooms([...rooms, newRoom])
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  }

}, [rooms]);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar_haederRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {
          rooms.map(room=>(
            <SidebarChat key={room._id} id={room._id} name={room.name}/>
          ))
        }
      </div>
    </div>
  );
}

export default Sidebar;
