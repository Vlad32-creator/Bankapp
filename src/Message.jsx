import './Message.css';

const Message = ({ exit, message }) => {
    return (
        <div id="messageWrapper">
            <button onClick={() => exit('main')} id='back'>
                <img src="/Bankapp/arrow.png" alt="back" />
            </button>
            <ul id='message'>
                {message.map((mes,index) => {
                    return (
                        <li key={index}>
                            <div>{mes.sender.slice(0,1)}</div>
                            <p>{mes.text}</p>
                            <canvas ref={canvas => {
                                if (canvas) {
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