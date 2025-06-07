import { useState, useEffect, useRef } from "react";
import './MainPage.css';
import RegistrationPage from "./RegistrationPage";
import UserAccount from "./UserAccount";


function Pages() {
    const [page, setPage] = useState('main');
    const [isRegistered, setIsRegistered] = useState(false);
    const [balance, setBalance] = useState();
    const [cardNumber, setCardNumber] = useState();

    async function check() {
        try {
            const response = await fetch('http://localhost:5000/checkTokens', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                return;
            } else {
                const res = await response.json();
                setPage('userAccount');
                setBalance(res.balance);
                setCardNumber('********' + res.cardNumber);
                setIsRegistered(true);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // if (!isRegistered) return;
        check();
    }, [])

    const checkRegistration = () => {
        if (isRegistered) {
            setPage('userAccount');
        } else {
            setPage("registration");
        }
    }

    const boxRefs = useRef([]);
    boxRefs.current = [];

    const addToRefs = (el) => {
        if (el && !boxRefs.current.includes(el)) {
            boxRefs.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entre => {
                const box = entre.target;
                if (entre.isIntersecting) {
                    if (box.classList.contains("card")) {
                        box.classList.add('cardAnimation');
                    }
                } else {
                    box.classList.remove('cardAnimation');
                }
            })
        }, {
            threshold: 0.3
        })

        boxRefs.current.forEach(box => observer.observe(box))
        return () => {
            boxRefs.current.forEach(box => observer.unobserve(box));
        }

    }, []);

    useEffect(() => {
        if (page !== 'main') return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entre => {
                const box = entre.target;
                if (entre.isIntersecting) {
                    if (box.classList.contains("card")) {
                        box.classList.add('cardAnimation');
                    }
                } else {
                    box.classList.remove('cardAnimation');
                }
            })
        }, {
            threshold: 0.3
        })

        boxRefs.current.forEach(box => observer.observe(box))
        return () => {
            boxRefs.current.forEach(box => observer.unobserve(box));
        }
    }, [page]);


    return (
        <>
            {page === "userAccount" && <UserAccount exit={setPage} balance={balance} cardNumber={cardNumber} />}
            {(page === 'main' || page === 'registration') &&
                <div id="wrapper">
                    {page === 'registration' &&
                        <RegistrationPage
                            setIsRegistered={setIsRegistered}
                            exit={setPage}
                            setCardNumber={setCardNumber}
                            setBalance={setBalance} />
                    }
                    <div id="mainPage">
                        <header>
                            <div id="logoBank">
                                <img id="mainLogoBank" src="/logoBank.png" alt="logo" />
                                Erval Bank
                            </div>
                            <nav id="navigation">
                                <a className="aNot" href="">Main</a>
                                <a href="">About</a>
                                <a className="aNot" href="">Possibilities</a>
                                <a href="">Friends</a>
                                <a href="">Contacts</a>
                            </nav>
                            <button onClick={checkRegistration} id="userAccountBtn">
                                <img id="userIcon" src="/userIcon.png" alt="userIcon" />
                            </button>
                        </header>

                        <main id="main-mainPage">
                            <div id="text-mainPage">
                                <h1>
                                    Open new possibilities with a Erval Banck.
                                </h1>
                                <p>Golden card for each client, because each client is important for us .</p>
                                <button onClick={() => setPage('registration')} id="registrationBtn">Registration</button>
                            </div>
                            <div id="golden-card-wrapper">
                                <div id="Blur-font"></div>
                                <div id="golden-card">
                                    <p id="golden-card-number">000-000-000-000</p>
                                    <p id="text-Golden-Card">Golden Card</p>
                                    <p id="text-Erval-Bank">Erval Bank</p>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div id="page2">
                        <h1>Custom Carts</h1>
                        <p id="page2-head">Each client can create own cart</p>
                        <article id="page2-content">
                            <aside id="custom-cards">

                                <div ref={addToRefs} id="casualCard" className="card">
                                    <p className="nameOfCard">
                                        Casual
                                    </p>
                                    <p className="numberOfCard">
                                        000-000-000-000
                                    </p>
                                    <p className="nameOfBank">
                                        ErvalBank
                                    </p>
                                </div>
                                <div ref={addToRefs} id="FunnyCard" className="card">
                                    <p className="nameOfCard">
                                        funny day
                                    </p>
                                    <p className="numberOfCard">
                                        000-000-000-000
                                    </p>
                                    <p className="nameOfBank">
                                        ErvalBank
                                    </p>
                                </div>
                                <div ref={addToRefs} id="invincibleCard" className="card">
                                    <p className="nameOfCard">
                                        invincible
                                    </p>
                                    <p className="numberOfCard">
                                        000-000-000-000
                                    </p>
                                    <p className="nameOfBank">
                                        ErvalBank
                                    </p>
                                    <div id="flagUkr" ></div>
                                </div>
                            </aside>
                            <main id="page2-text">
                                <h3>We provide flexible tools for your card</h3>
                                <p>
                                    Tools  can help you create your  style,
                                    your vibe, your mood. No to boring cards,
                                    no limit . You can change your stile every day.
                                    Your card your face, embellish it.
                                </p>
                                <p>
                                    Always wont to share my creativity,
                                    so share your map with a friend
                                </p>
                                <p>Also your card can have a name. Name it .</p>
                            </main>
                        </article>
                    </div>
                    <footer>
                        <main>
                            <div id="attention">
                                <h1>Attention!!!</h1>
                                <div className="textInFooter">
                                    This Bank not real and  all cards cannot be a means of payment butt you can make translations.
                                    This bank was made for educational purposes.
                                    Do not perceive this bank as real, but only as a manifestation of my creativity.
                                    Try all features .
                                </div>
                            </div>
                            <div id="possibilities">
                                <h2>Possibilities</h2>
                                <div className="textInFooter">
                                    After registration you can color your card,
                                    you can make transfer to your  friends,
                                    you can send your card to you friends.
                                </div>
                            </div>
                        </main>
                        <section>
                            <h2>Contact Information</h2>
                            <div id="contacts">
                                <a href="https://www.instagram.com/valerakhovanovv" target="_blank">
                                    <button className="contactBtn">
                                        <img className="contactImg" src="/instagramIcon.png" alt="instagram" />
                                    </button>
                                </a>

                                <a href="https://t.me/ValerijKhovanov" target="_blank">
                                    <button className="contactBtn">
                                        <img className="contactImg" src="/telegramIcon.svg" alt="telegram" />
                                    </button>
                                </a>

                                <a href="https://github.com/Vlad32-creator" target="_blank">
                                    <button className="contactBtn">
                                        <img className="contactImg" src="/githubIcon.svg" alt="github" />
                                    </button>
                                </a>
                            </div>
                        </section>
                    </footer>
                </div>
            }
        </>
    )
}

export default Pages;