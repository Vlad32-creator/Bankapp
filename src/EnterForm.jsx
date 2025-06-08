import { useState, useRef, useEffect } from 'react'
import './EnterForm.css';
import {MainLoader} from './loaders';


const EnterForm = ({ exit, setPage ,setBalance,setCardNumber}) => {
    const [checkPas, setCheckPas] = useState(false);
    const containerRef = useRef(null);
    const nameRef = useRef();
    const passwordRef = useRef();
    const [loader,setLoader] = useState(false);
    const passwordErrorRef = useRef();
    const nameErrorRef = useRef();

    const login = async () => {
       setLoader(true);
        const response = await fetch('http://localhost:5000/login', {
            method: "Post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameRef.current.value,
                password: passwordRef.current.value
            }),
            credentials: 'include'
        })

        if (!response.ok) {
            const error = response.json();
            console.log('was error', error);
            exit('main');
        } else {
            const data = await response.json();

            if (data.Error) {
                const error = data.Error;
                passwordErrorRef.current.textContent = error.password;
                nameErrorRef.current.textContent = error.name;
                setLoader(false);
                return;
            }
            localStorage.setItem('userColor',data.color);
            localStorage.setItem('userName',data.name);
            setBalance(data.balance); 
            setCardNumber('********'+data.cardNumber);
            setLoader(false);
            exit('userAccount');
        }
    }
    const exitHandler = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            exit('main');
        }
    }
    useEffect(() => {
        document.addEventListener('mouseup',exitHandler);
        return () => {
            document.removeEventListener('mouseup',exitHandler);
        }
    },[])

    return (
        <div id="container">
            {loader && <MainLoader/>}
            <main ref={containerRef} id='enterAccountContent' >
                <div id='exit' onClick={() => exit('main')}>&#10007;</div>
                <h1 id='registrationLogo'>
                    <img id='logoImage' src="/Bankapp/logoBank.png" alt="logo" />
                    Erval Bank
                </h1>
                <div id='information'>Enter Your account details</div>
                <div id='inputs'>
                    <form action="">
                        <div ref={nameErrorRef} id='errorName'></div>
                        <input ref={nameRef } id='inputName' type="text" placeholder='Name' />

                        <div ref={passwordErrorRef} id='errorPassword'></div>
                        <div>
                            <input ref={passwordRef} placeholder='Password' type={checkPas ? 'text' : 'password'} />
                        </div>
                    </form>
                </div>
                <div>
                    <button onClick={() => setPage('registration')} style={{ background: 'transparent', border: 'none' }}>Register account</button>
                    <button onClick={login} id='submitBtn'>submit</button>
                </div>
            </main>
        </div>
    )
}

export default EnterForm;