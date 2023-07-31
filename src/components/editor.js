 import React, { useEffect ,useRef} from 'react'
 import Codemirror from "codemirror";
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/dracula.css'
import 'codemirror/lib/codemirror.css'
import "codemirror/addon/edit/closetag"
import "codemirror/addon/edit/closebrackets"
import ACTIONS from '../Actions';



const Editor = ({socketRef,roomId,onCodeChange}) => {
    const codeMirrorRef = useRef(null);
    const editorRef = useRef(null);
    useEffect(() =>{
        //let codeMirrorInstance;
        
        async function init(){
            if(!codeMirrorRef.current){
                codeMirrorRef.current=Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: {name: 'javascript', json:true},
                theme: 'dracula',
                autoCloseTags:true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });
            editorRef.current = codeMirrorRef.current;
        }

        
        
        editorRef.current.on('change',(instance,changes)=>{
            console.log('change',changes);
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if(origin!== 'setValue'){
               // console.log("working", code);
               //console.log('both',roomId,code);
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                    roomId,
                    code,
                });
            }
            console.log(code);
           
           
        })
      
        }
        init();
    }, [])

    useEffect(()=>{
        if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            console.log("RECIEVING",code);
            if(code!==null){
                 editorRef.current.setValue(code);
            }
        })
        return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }
        

    },[socketRef.current])

  return (<textarea id="realtimeEditor" ></textarea>)
}

export default Editor


