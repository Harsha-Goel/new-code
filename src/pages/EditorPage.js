import React, { useEffect, useRef, useState } from 'react'
import Client from "../components/Client"
import Editor from '../components/editor.js'
import {initSocket} from '../socket'
import ACTIONS from '../Actions'
import toast from "react-hot-toast"

import {Navigate, useLocation,useNavigate,useParams} from 'react-router-dom'
const EditorPage = () => {

  const [clients,setClients] =useState([]);
  const codeRef =useRef(null)
  const socketRef = useRef(null);
  const location = useLocation()
  const reactNavigator= useNavigate()
  const {roomId} = useParams();
  useEffect(()=>{
    const init = async ()=>{
      socketRef.current =await initSocket();
      socketRef.current.on('connect_error',(err)=> handleErrors(err));
      socketRef.current.on('connect_failed',(err)=> handleErrors(err));
      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed ,try agin later');
        reactNavigator('/')
      }
      console.log('rooom',roomId);
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      });


      //listening for joined object

      socketRef.current.on(
        ACTIONS.JOINED,
        ({clients,username,socketId})=>{
          setClients(clients)
          if(username!== location.state?.username){
            //toast.success(`${username} joined the room.`)
            console.log(`${username} joined`)
            //id: `${socketId}-joined`
          }
          setClients(clients)
         // setClients(clients)
          //setClients((prevClients) =>[...prevClients ,{socketId,username}])
        }
      )
      // listening for Disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({socketId,username})=>{
         // toast.success(`${username} left the room.`)
          setClients((prev)=>{
            return prev.filter(
              (client)=> client.socketId !== socketId)
          })
        }
      )
      return ()=>{
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
    init();
    
  },[])


  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('RoomId has been copied to your clipboard')
    }catch(err){
      toast.error("Could not copy roomId")
    }
  }

  function leaveRoom(){
    reactNavigator('/');
  }

  
  if(!location.state){
    return <Navigate to='/' />
  }



  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/CODE-SYNC.png" alt="logo"/>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
              {
                clients.map((client) =>(
                  <Client  key={client.socketId} socketId={client.socketId} username={client.username} />
                ))
              }
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) =>{
          codeRef.current=code;
        }}/>
      </div>
    </div>
  )
}

export default EditorPage