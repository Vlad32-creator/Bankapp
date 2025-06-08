import { useState, useRef, useEffect } from 'react'
import "./RegistrationPage.css";
import EnterForm from './EnterForm';
import {MainLoader} from './loaders';

const RegistrationPage = ({ exit,setIsRegistered ,setBalance,setCardNumber}) => {
    const [checkPas, setCheckPas] = useState(false);
    const [enterOrRegistration, setEnterOrRegistration] = useState('registration');
    const [flipped, setFlipped] = useState(false);
    const nameRef = useRef();
    const passRef = useRef();
    const nameErrorRef = useRef();
    const passwordErrorRef = useRef();

    const containerRef = useRef(null);

    const exitHandler = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            exit('main');
        }
    }

    const registration = async () => {
        setEnterOrRegistration('loader');
        const response = await fetch('http://localhost:5000/registration', {
            method: "Post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameRef.current.value,
                password: passRef.current.value
            }),
            credentials: 'include'
        })

        if (!response.ok) {
            const error = await response.json();
            console.log('was error', error);
            exit('main')
        } else {
            const data = await response.json();

            if (data.Error) {
                const error = data.Error;
                passwordErrorRef.current.textContent = error.password;
                nameErrorRef.current.textContent = error.name;
                setEnterOrRegistration('registration');
                return;
            }
            localStorage.setItem('userColor',data.userColor);
            localStorage.setItem('userName',data.name);
            setCardNumber('********'+data.cardNumber);
            setBalance(data.balance);
            setIsRegistered(true);
            setEnterOrRegistration('registration')
            exit('userAccount');
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', exitHandler);
        return () => {
            document.removeEventListener('mouseup', exitHandler);
        }
    }, [])


    const handelFlip = () => {
        setFlipped(prev => !prev);
    }

    return (
        <>
            {enterOrRegistration === 'enter' && <EnterForm exit={exit} setPage={setEnterOrRegistration} setBalance={setBalance} setCardNumber={setCardNumber}/>}
            {(enterOrRegistration === 'registration' || enterOrRegistration === 'loader') &&
                <>

                    <div id='container'>
                        {enterOrRegistration === 'loader' && <MainLoader />}
                        <main ref={containerRef} id='registrationContent' className={flipped ? "flipped" : ''}>
                            {flipped &&
                                <p id='devilText' onClick={handelFlip}>
                                    By signing this contract
                                    you give your soul to the
                                    devil for free 😈
                                </p>
                            }{!flipped &&
                                <>
                                    <div className='append' onClick={() => exit('main')} id='exit'>&#10007;</div>
                                    <h1 className='append' id='registrationLogo'>
                                        <img id='logoImage' src="/Bankapp/logoBank.png" alt="logo" />
                                        Erval Bank
                                    </h1>
                                    <div className='append' id='inputs'>
                                        <form action="">
                                            <div ref={nameErrorRef} id='errorName'></div>
                                            <input ref={nameRef} name='username' id='inputName' type="text" placeholder='Name' />

                                            <div id='registrationPasswordInput'>
                                                <div ref={passwordErrorRef} id='errorPassword'></div>
                                                <input ref={passRef} name='password' placeholder='Password' type={checkPas ? 'text' : 'password'} autoComplete="current-password"/>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='append'>
                                        <button onClick={() => setEnterOrRegistration('enter')} style={{ background: 'transparent', border: 'none' }}>Enter to account</button>
                                        <button onClick={registration} id='submitBtn'>submit</button>
                                    </div>
                                    <div className='append' onClick={handelFlip} id='flipCard'></div>
                                </>
                            }
                        </main>
                    </div>
                </>
            }
        </>

    )
}

export default RegistrationPage;