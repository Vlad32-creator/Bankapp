import { MainLoader } from "./loaders";
import "./SendMessage.css"
import { useEffect, useRef, useState } from 'react';

const SendMessageForm = ({ sendCardRef, setSendForm, sendCard }) => {
    const recipientRef = useRef();
    const textRef = useRef();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        function clickOutside(e) {
            if (sendCardRef.current && !sendCardRef.current.contains(e.target)) {
                setSendForm(false);
            }
        }
        document.addEventListener('mouseup', clickOutside);
        return () => {
            document.removeEventListener('mouseup', clickOutside);
        }
    }, [])

    const sendMessage = async () => {
        setLoader(true);
        const message = { text: textRef.current.value, recipient: recipientRef.current.value, card: sendCard };
        const response = await fetch('https://bankappbackand.onrender.com/message', {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })

        if (!response.ok) {
            setLoader(false);
        } else {
            setLoader(false);
        }
        setSendForm(false);
    }

    return (
        <>
            {loader && <MainLoader/>}
            <div ref={sendCardRef} id="SendMessageFormWrapper">
                <h3>Message</h3>
                <input ref={recipientRef} type="text" placeholder="Recipient" />
                <textarea ref={textRef} name="" id=""></textarea>
                <button onClick={sendMessage}>send</button>
            </div>
        </>
    )
}

export default SendMessageForm;