import './Message.css';
import { useRef } from 'react';

const Message = ({ exit, message, setCards }) => {
    const canvasRefs = useRef({});
    const copyCard = (index) => {
        const newCard = { draw: canvasRefs.current[index].toDataURL(), id: Date.now() + Math.random() };

        setCards(prev => {
            const updated = prev.length > 16 ? prev : [...prev, newCard].reverse();
            localStorage.setItem('cards', JSON.stringify(updated));
            return updated;
        });
        exit('cards');
    }
    return (
        <div id="messageWrapper">
            <button onClick={() => exit('main')} id='back'>
                <img src="/Bankapp/arrow.png" alt="back" />
            </button>
            <ul id='message'>
                {message.map((mes, index) => {
                    return (
                        <li key={index}>
                            <div>{mes.sender.slice(0, 1)}</div>
                            <p>{mes.text}</p>
                            <button onClick={() => copyCard(index)} id='copyBtn'>copy</button>
                            <canvas ref={canvas => {
                                if (canvas) {
                                    canvasRefs.current[index] = canvas;
                                    const ctx = canvas.getContext('2d');
                                    const img = new Image();
                                    img.crossOrigin = 'anonymous';
                                    img.src = mes.card;
                                    img.onload = () => {
                                        canvas.width = img.width;
                                        canvas.height = img.height;
                                        ctx.drawImage(img, 0, 0);
                                    }
                                }
                            }}></canvas>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default Message;