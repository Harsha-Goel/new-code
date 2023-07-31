import React, { useState } from 'react'
import {v4 as uuidv4} from "uuid"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
const Home = () => {
  const navigate = useNavigate();
  const [roomID,setRoomID] =useState("");
  const [username,setUsername] =useState("")
  const joinRoom =()=>{
    if(!roomID || !username){
      toast.error("Both RoomID and Username is required");
      return ;
    }
    navigate(`/editor/${roomID}`,{
      state:{
        username,
      }
    })
  }
  const createNewRoom = (e) =>{
    e.preventDefault() // this will prevent the page to reload on clicking new room
    const id =uuidv4()
    setRoomID(id)
    toast.success('Successfully created a new room');
   // console.log(id);
  }
const handleInputEnter=(e)=>{
  //console.log("event", e.code) e.code will give the key pressed
  if(e.code==="Enter"){
    joinRoom()
  }
}

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="./CODE-SYNC.png" alt="" />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input type="text" className="inputBox" placeholder="ROOM ID" onChange={(e)=>setRoomID(e.target.value)} value={roomID} onKeyUp={handleInputEnter}/>
          <input type="text" className="inputBox" placeholder="USERNAME" onChange={(e)=>setUsername(e.target.value)}value={username} onKeyUp={handleInputEnter}/>
          <button onClick={joinRoom}className="btn joinBtn">Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 &nbsp;by &nbsp;
          <a href="https://github.com/Harsha-Goel">Harsha Goyal</a>
        </h4>
      </footer>
    </div>
  )
}

export default Home