import "./SendMessage.css"
import { useEffect,useRef } from 'react';

const SendMessageForm = ({sendCardRef,setSendForm,sendCard}) => {
    const recipientRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        function clickOutside(e){
            if (sendCardRef.current && !sendCardRef.current.contains(e.target)) {
                setSendForm(false);
            }
        }
        document.addEventListener('mouseup',clickOutside);
        return () => {
            document.removeEventListener('mouseup',clickOutside);
        }
    },[])

    const sendMessage = async () => {
        const message = {text: textRef.current.value,recipient: recipientRef.current.value,card: sendCard};
        const response = await fetch('http://localhost:5000/message',{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })

        if (!response.ok) {
            console.log(response);
        }else{
            console.log('send');
        }
        setSendForm(false);
    }

    return(
        <div ref={sendCardRef} id="SendMessageFormWrapper">
            <h3>Message</h3>
            <input ref={recipientRef} type="text" placeholder="Recipient"/>
            <textarea ref={textRef} name="" id=""></textarea>
            <button onClick={sendMessage}>send</button>
        </div>
    )
}

export default SendMessageForm;