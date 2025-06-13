import { useState, useRef } from 'react';
import './Cards.css';
import SendMessageForm from './SendMessage';


const Cards = ({
    exit,
    cards,
    setCards,
    setSendCard,
    sendCard,
    setCustomCard,
    setCustomCardColor,
}) => {
    const [sendForm, setSendForm] = useState(false);
    const inputCardRef = useRef();
    const canvasRefs = useRef({});
    const [deletePanel, setDeletePanel] = useState(false);
    const [id, setId] = useState();

    const deleteCard = () => {
        setCards(prev => {
            const update = prev.filter((card) => card.id !== id);
            localStorage.setItem('cards', JSON.stringify(update));
            return update;
        }
        );
        setDeletePanel(false);
    }
    const openDeletePanel = (id) => {
        setDeletePanel(true);
        setId(id);
    }
    const sendMyCard = (id) => {
        setSendCard(canvasRefs.current[id].toDataURL());
        setSendForm(true);
    }
    const changeCard = (id, name) => {
        setCustomCardColor({ draw: canvasRefs.current[id].toDataURL(), name: name });
        setCustomCard(true);
        exit('main');
    }

    return (
        <>
            {sendForm && <SendMessageForm sendCardRef={inputCardRef} setSendForm={setSendForm} sendCard={sendCard} />}
            <div id="CardsWrapper">
                {deletePanel &&
                    <div id='wrapperDeletePanel'>
                        <h3>Do you want to delete the card?</h3>
                        <div id='deleteOrNot'>
                            <button onClick={deleteCard}>Yes</button>
                            <button onClick={() => setDeletePanel(false)}>No</button>
                        </div>
                    </div>
                }
                <button id='exitBtn' onClick={() => exit('main')}>
                    <img src="/Bankapp/arrow.png" alt="back" />
                </button>
                <ul>
                    {cards.map((card) => {
                        if (card === null || card === undefined) return;
                        return (
                            <li key={card.id}>
                                <div>
                                    <button className='buttons'>
                                        <img className='imgPaint' src="/Bankapp/paint.png" alt="paint" />
                                    </button>
                                    <button onClick={() => changeCard(card.id, card.name)} className='buttons'>
                                        <img className='imgCustomCard' src="/Bankapp/customCard.png" alt="changeCard" />
                                    </button>
                                    <button className='buttons' onClick={() => sendMyCard(card.id)}>
                                        <img className='imgSend' src="/Bankapp/send.png" alt="send" />
                                    </button>
                                    <button id='buttons' className='buttons' onClick={() => openDeletePanel(card.id)}>❌</button>
                                </div>
                                <span className='cardName'>{card.name ? card.name : ''}</span>
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