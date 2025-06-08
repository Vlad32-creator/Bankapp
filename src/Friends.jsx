import './Friends.css'
import { useRef, useState } from 'react';

const Friends = ({ exit, allUsers }) => {
    const inputRef = useRef();
    const [filteredUsers, setFilteredUsers] = useState();
    const [filter, setFilter] = useState(false);

    const searchUser = () => {
        if (inputRef.current.value.trim() === '') {
            setFilter(false);
            return;
        };
        const filtered = allUsers.filter(user => user.userName.includes(inputRef.current.value));
        setFilteredUsers(filtered);
        setFilter(true);
    }
    const Filtered = () => {
        return (
            <>
                {filteredUsers.map((user, index) => {
                    return (
                        <li key={index}>
                            <div style={{ background: user.userColor }}>{user.userName.slice(0, 1)}</div>
                            <h3>{user.userName}</h3>
                            <button>sed</button>
                        </li>
                    )
                })}
            </>
        )
    }

    return (
        <div id="FriendsWrapper">
            <button id='backBtn' onClick={() => exit('main')}>
                <img src="/Bankapp/arrow.png" alt="back" />
            </button>
            <div id='inputWrapper'>
                <input ref={inputRef} type="text" />
                <button onClick={searchUser}>share</button>
            </div>
            <nav>
                <button className='navBtnFriends'>All Users</button>
            </nav>
            <ul id='addFriend'>
                {filter && <Filtered />}
                {!filter && allUsers.map((user, index) => {
                    return (
                        <li key={index}>
                            <div style={{ background: user.userColor }}>{user.userName.slice(0, 1)}</div>
                            <h3>{user.userName}</h3>
                            <button onClick={() => exit('cards')}>sed</button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Friends;