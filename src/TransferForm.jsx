import './TransferForm.css';
import {useRef} from 'react';

 const TransferForm = ({transferPanelRef,setPage}) => {
    const numberOfCardRef = useRef();
    const sumRef = useRef();

    const maceTransfer = async () => {
        const response = await fetch('https://bankappbackand.onrender.com/transfer',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                money: Number(sumRef.current.value),
                recipientCard: numberOfCardRef.current.value
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            return;
        }else{
            const res = await response.json();
            console.log(res);
            setPage('main');
        }
    }

    return (
        <div ref={transferPanelRef} id='TransferFormWrapper'>
            <div>
                <img src="/Bankapp/logoBank.png" alt="logo" />
                <h2>Transfer</h2>
            </div>
            <main>
                <input ref={numberOfCardRef } type="number" placeholder='Enter card number'/>
                <input ref={sumRef} type="number" placeholder='Enter sum'/>
                <button onClick={maceTransfer}>Send</button>
            </main>
        </div>
    )
}

export default TransferForm;