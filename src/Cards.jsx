import { useState, useRef } from 'react';
import './Cards.css';
import SendMessageForm from './SendMessage';


const Cards = ({ exit, cards, setCards, setSendCard, sendCard }) => {
    const [sendForm, setSendForm] = useState(false);
    const inputCardRef = useRef();
    const canvasRefs = useRef({});

    const deleteCard = (indexCard) => {
        setCards(prev => {
            const update = cards.filter((card) => card.id !== indexCard)
            localStorage.setItem('cards', JSON.stringify(update));
            return update;
        }
        );
    }
    const sendMyCard = (id) => {
        setSendCard(canvasRefs.current[id].toDataURL());
        setSendForm(true);
    }

    return (
        <>
            {sendForm && <SendMessageForm sendCardRef={inputCardRef} setSendForm={setSendForm} sendCard={sendCard} />}
            <div id="CardsWrapper">
                <button onClick={() => exit('main')}>
                    <img src="/Bankapp/arrow.png" alt="back" />
                </button>
                <ul>
                    {cards.map((card) => {
                        if (card === null || card === undefined) return;
                        return (
                                <li key={card.id}>
                                    <div>
                                        <button onClick={() => sendMyCard(card.id)}>
                                            <img src="/Bankapp/send.png" alt="send" />
                                        </button>
                                        <button onClick={() => deleteCard(card.id)}>❌</button>
                                    </div>
                                    <canvas
                                        ref={canvas => {
                                            if (canvas) {
                                                canvasRefs.current[card.id] = canvas;
                                                const ctx = canvas.getContext("2d");
                                                const img = new Image();
                                                img.crossOrigin = 'anonymous';
                                                img.src = card.draw;
                                                img.onload = () => {
                                                    canvas.width = img.width;
                                                    canvas.height = img.height;
                                                    ctx.drawImage(img, 0, 0);
                                                };
                                            }
                                        }}
                                    ></canvas>
                                </li>
                        )
                    })

                    }
                </ul>
            </div>
        </>
    )
}

export default Cards