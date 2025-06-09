import { useState, useRef, useEffect } from 'react';
import './UserAccount.css';
import CreateCustomCard from './CreateCustomCard';
import TransferForm from './TransferForm';
import Cards from './Cards';
import Friends from './Friends';
import Message from './Message';
import { CopyLoader, MainLoader } from './loaders';


const UserAccount = ({ exit, balance, cardNumber }) => {
    const [page, setPage] = useState('main');
    const transferPanelRef = useRef();
    const [settings, setSettings] = useState(false);
    const [cards, setCards] = useState([]);
    const [loader, setLoader] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [sendCard, setSendCard] = useState();
    const [message, setMessage] = useState();
    const [mainLoader, setMainLoader] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('cards');
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                setCards(parsed);
            } else {
                console.warn('localStorage.cards is not an array:', parsed);
            }
        } catch (e) {
            console.error('Ошибка при разборе JSON из localStorage:', e);
        }
    }, [])

    const copyCard = async () => {
        const cardNum = await fetch('https://bankappbackand.onrender.com/getCardNumber', {
            method: "GET",
            credentials: 'include'
        });
        if (!cardNum.ok) {
            console.log('was error');
        } else {
            const card = await cardNum.json();
            navigator.clipboard.writeText(card.cardNumber);
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
            }, 1000)
        }
    }
    const users = async () => {
        setMainLoader(true);
        const response = await fetch("https://bankappbackand.onrender.com/getUsers", {
            method: "GET",
            credentials: 'include'
        })
        if (!response.ok) {
            console.log(response);
            setMainLoader(false);
        } else {
            const users = await response.json();
            setAllUsers([...users]);
            setPage('friends');
            setMainLoader(false);
        }
    }

    const openSettings = () => {
        setSettings(prev => !prev);
    }

    const clickOutsideTransfer = (e) => {
        if (transferPanelRef.current && !transferPanelRef.current.contains(e.target)) {
            setPage('main');
        }
    }
    const messagePage = async () => {
        setMainLoader(true);
        const response = await fetch('https://bankappbackand.onrender.com/getMessage', {
            method: "GET",
            credentials: 'include'
        })
        if (!response.ok) {
            console.log(response);
            setMainLoader(false);
        } else {
            const res = await response.json();
            setMessage(res.reverse());
            setMainLoader(false);
        }
        setPage('message')
    }

    useEffect(() => {
        document.addEventListener('mouseup', clickOutsideTransfer);
        return () => {
            document.removeEventListener('mouseup', clickOutsideTransfer);
        }
    }, [])

    return (
        <>
            {page === 'createCard' && <CreateCustomCard exit={setPage} setCards={setCards} cards={cards} />}
            {page === 'friends' && <Friends exit={setPage} allUsers={allUsers} />}
            {page === 'message' && <Message exit={setPage} message={message} setCards={setCards}/>}
            {(page === 'main' || page === 'transfer' || page === 'cards') &&
                <>
                    <div id='userAccount-Wrapper'>
                        {mainLoader && <MainLoader />}
                        {loader && <CopyLoader />}
                        {page === 'transfer' && <TransferForm transferPanelRef={transferPanelRef} setPage={setPage} setMainLoader={setMainLoader} />}
                        {page === 'cards' && <Cards exit={setPage} cards={cards} setCards={setCards} setSendCard={setSendCard} sendCard={sendCard} />}
                        <header id='userAccount-Header'>
                            <button style={{ background: localStorage.getItem('userColor'), fontSize: '2rem', color: 'white' }} onClick={openSettings}>{localStorage.getItem('userName')[0]}</button>
                            {settings &&
                                <ul>
                                    <li onClick={() => exit('main')}>Main</li>
                                    <li>Settings</li>
                                    <li>Log out</li>
                                </ul>
                            }
                            <div id='userAccount-Logo'>
                                Erval Bank
                                <img id='userAccount-LogoImage' src="/Bankapp/logoBank.png" alt="logo" />
                            </div>
                        </header>
                        <main id='userAccount-Main'>
                            <div id='userAccount-CardsContainer'>
                                <div id='userAccount-GoldenCard' className='UserAccountCard'>
                                    <div className='CardNameCard'>Golden Card</div>
                                    <div className='CardNumberCard'>
                                        {cardNumber}
                                    </div>
                                    <button onClick={copyCard} className='copyBtn'>
                                        <img src="/Bankapp/copy.svg" alt="copyIcon" />
                                    </button>
                                    <div className='Balance'>
                                        Balance:
                                        <span>{balance}</span>
                                    </div>
                                    <div className='CardNameBank'>Erval Bank</div>
                                </div>
                            </div>
                            <button onClick={() => setPage("createCard")} id='addCustomCard'>
                                <img src="/Bankapp/addIcon.png" alt="add card" />
                            </button>
                        </main>
                        <nav id='userAccount-Nav'>
                            <div id='userAccount-NavBar'>
                                <button id='topUpButton' onClick={() => setPage('transfer')} className='navItem'>
                                    <img src="/Bankapp/transition.png" alt="top up" />
                                </button>
                                <button onClick={() => setPage('cards')} id='transitionButton' className='navItem'>
                                    <img src="/Bankapp/cardLogo.png" alt="transition" />
                                </button>
                                <button onClick={messagePage} className='navItem'>
                                    <img src="/Bankapp/historyImage.png" alt="history" />
                                </button>
                                <button onClick={users} className='navItem'>
                                    <img src="/Bankapp/friendsIcon.png" alt="friends" />
                                </button>
                            </div>
                        </nav>
                    </div>
                </>
            }
        </>
    )
}

export default UserAccount;