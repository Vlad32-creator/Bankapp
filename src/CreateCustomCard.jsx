import { useRef, useEffect, useState } from "react";
import "./CreateCustomCard.css";
import { back, Background, PenPanel, TextPanel, ShapesPanel, AddCustomCardPanel } from "./CreateCardTools"
import Cards from "./Cards";

export default function CreateCustomCard({ exit, setCards, cards }) {
    const canvasRef = useRef();
    const [tools, setTools] = useState('pen');
    const colorRef = useRef();
    const lineWidthRef = useRef();
    const [savingCanvas, setSavingCanvas] = useState([]);
    const [undo, setUndo] = useState(1);
    const [wasUndo, setWasUndo] = useState(false);
    const shadowColorRef = useRef('black');
    const [effects, setEffects] = useState([]);
    const pensPanelRef = useRef();
    const armsRef = useRef(3);
    const widthBallsRef = useRef();
    const backgroundRef = useRef();
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const [itemLinerGradient, setItemLinerGradient] = useState([]);
    const [itemRadialGradient, setItemRadialGradient] = useState([]);
    const [cordRectLinerGradient, setCordRectLinerGradient] = useState(
        {
            rect1: { x: 20, y: 20, width: 20, height: 20 },
            rect2: { x: 400, y: 200, width: 20, height: 20 }
        });
    const [cordRectRadialGradient, setCordRectRadialGradient] = useState({
        rect1: { x: 20, y: 20, r: 0, width: 20, height: 20 },
        rect2: { x: 50, y: 50, r: 0, width: 20, height: 20 }
    });
    const [block, setBlock] = useState('');
    const excludedKeys = [
        'Enter', 'Backspace', 'Alt', 'Meta', 'Shift',
        'Control', 'AltGraph', 'ArrowLeft', 'ArrowLeft',
        'ArrowUp', 'ArrowDown', 'ArrowRight', 'End', 'Delete', 'Home', 'Insert',
        'F12', 'F11', 'F10', 'F9', 'F8', 'F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1'
    ];
    const textColorRef = useRef();
    const fontRef = useRef();
    const [cordText, setCordText] = useState({ offsetX: 0, offsetY: 0, clientX: 0, clientY: 0 });
    const textRef = useRef();
    const [showInput, setShowInput] = useState(false);
    const inputTextRef = useRef();
    const shapesPanelRef = useRef();
    const bufferCanvasRef = useRef();
    const bufferCtxRef = useRef();
    const [cordOfShape, setCordOfShape] = useState({ firstX: 0, firstY: 0, lastX: 0, lastY: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const shapesStrokeColorRef = useRef();
    const shapesFillColorRef = useRef();
    const isShapeFillColorRef = useRef();
    const isShapeStrokeColorRef = useRef();
    const [isCheckedFill, setIsCheckedFill] = useState(true);
    const [isCheckedStroke, setIsCheckedStroke] = useState(true);
    const addNewCardRef = useRef();
    const nameOfCardRef = useRef();

    const clearHandler = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferCtx = bufferCtxRef.current;
        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferCtx = bufferCtxRef.current;
        if (!bufferCtx) return;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setSavingCanvas(prev => {
            try {
                const base = wasUndo && undo > 0
                    ? prev.slice(0, prev.length - undo)
                    : prev;
                if (base !== undefined) {
                    const updated = base.length >= 15 ? base.slice(1) : base;
                    return [...updated, canvas.toDataURL()];
                } else {
                    return prev;
                }
            } catch (e) {
                console.log(e);
            }
        });
        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.drawImage(canvas, 0, 0);
    }, [backgroundColor])
    // Shapes

    function beginDraw(e) {
        setCordOfShape(prev => ({ ...prev, firstX: e.offsetX, firstY: e.offsetY }));
        setIsDrawing(true);
    }

    function endDraw() {
        const canvas = canvasRef.current;
        const bufferCtx = bufferCtxRef.current;
        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.drawImage(canvas, 0, 0);
        setIsDrawing(false);
    }

    function straightLine(e) {
        if (!isDrawing) return;
        if (tools === 'straightLine') {
            const ctx = canvasRef.current.getContext('2d');
            const canvas = canvasRef.current;
            const bufferCanvas = bufferCanvasRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            setCordOfShape(prev => ({ ...prev, lastX: e.offsetX, lastY: e.offsetY }))

            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = lineWidthRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent'
            ctx.beginPath()
            ctx.moveTo(cordOfShape.firstX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.stroke();
        }
    }
    function circle(e) {
        if (!isDrawing) return;
        if (tools === 'circle') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            setCordOfShape(prev => ({ ...prev, lastX: e.offsetX, lastY: e.offsetY }));
            const middleX = cordOfShape.firstX + (cordOfShape.lastX - cordOfShape.firstX) / 2;
            const middleY = cordOfShape.firstY + (cordOfShape.lastY - cordOfShape.firstY) / 2;
            const radius = Math.abs(cordOfShape.lastX - middleX);

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = lineWidthRef.current.value;
            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }
            ctx.beginPath();
            ctx.arc(middleX, middleY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
    function rectangle(e) {
        if (!isDrawing) return;
        if (tools === 'rectangle') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;
            if (!canvas) return;
            setCordOfShape(prev => ({ ...prev, lastX: e.offsetX, lastY: e.offsetY }))
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            const width = cordOfShape.lastX - cordOfShape.firstX;
            const height = cordOfShape.lastY - cordOfShape.firstY;

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = lineWidthRef.current.value;

            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }
            ctx.beginPath();
            ctx.rect(cordOfShape.firstX, cordOfShape.firstY, width, height);
            ctx.stroke();
            ctx.fill();
        }
    }
    function triangle(e) {
        if (!isDrawing) return;
        if (tools === 'triangle') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;
            if (!canvas) return;
            setCordOfShape(prev => ({ ...prev, lastX: e.offsetX, lastY: e.offsetY }));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = 1;

            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }

            const middleX = cordOfShape.firstX + (cordOfShape.lastX - cordOfShape.firstX) / 2;
            ctx.beginPath();
            ctx.moveTo(middleX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.moveTo(middleX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.firstX, cordOfShape.lastY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.stroke();
            ctx.fill()
        }
    }

    function touchBeginDraw(e) {
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        setCordOfShape(prev => ({ ...prev, firstX: x, firstY: y }));
        setIsDrawing(true);
    }

    function touchEndDraw() {
        const canvas = canvasRef.current;
        const bufferCtx = bufferCtxRef.current;
        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.drawImage(canvas, 0, 0);
        setIsDrawing(false);
    }


    function touchStraightLine(e) {
        if (!isDrawing) return;
        if (tools === 'straightLine') {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            const ctx = canvasRef.current.getContext('2d');
            const canvas = canvasRef.current;
            const bufferCanvas = bufferCanvasRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            setCordOfShape(prev => ({ ...prev, lastX: x, lastY: y }));

            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = lineWidthRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent'
            ctx.beginPath()
            ctx.moveTo(cordOfShape.firstX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.stroke();
        }
    }
    function touchCircle(e) {
        if (!isDrawing) return;
        if (tools === 'circle') {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            setCordOfShape(prev => ({ ...prev, lastX: x, lastY: y }));
            const middleX = cordOfShape.firstX + (cordOfShape.lastX - cordOfShape.firstX) / 2;
            const middleY = cordOfShape.firstY + (cordOfShape.lastY - cordOfShape.firstY) / 2;
            const radius = Math.abs(cordOfShape.lastX - middleX);

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = lineWidthRef.current.value;
            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }
            ctx.beginPath();
            ctx.arc(middleX, middleY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
    function touchRectangle(e) {
        if (!isDrawing) return;
        if (tools === 'rectangle') {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;
            if (!canvas) return;
            setCordOfShape(prev => ({ ...prev, lastX: x, lastY: y }));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);
            const width = cordOfShape.lastX - cordOfShape.firstX;
            const height = cordOfShape.lastY - cordOfShape.firstY;

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = lineWidthRef.current.value;

            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }
            ctx.beginPath();
            ctx.rect(cordOfShape.firstX, cordOfShape.firstY, width, height);
            ctx.stroke();
            ctx.fill();
        }
    }
    function touchTriangle(e) {
        if (!isDrawing) return;
        if (tools === 'triangle') {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const bufferCanvas = bufferCanvasRef.current;
            if (!canvas) return;
            setCordOfShape(prev => ({ ...prev, lastX: x, lastY: y }));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bufferCanvas, 0, 0);

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = shapesFillColorRef.current.value;
            ctx.strokeStyle = shapesStrokeColorRef.current.value;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = 1;

            if (!isCheckedFill) {
                ctx.fillStyle = 'transparent';
            } if (!isCheckedStroke) {
                ctx.strokeStyle = 'transparent';
            }

            const middleX = cordOfShape.firstX + (cordOfShape.lastX - cordOfShape.firstX) / 2;
            ctx.beginPath();
            ctx.moveTo(middleX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.moveTo(middleX, cordOfShape.firstY);
            ctx.lineTo(cordOfShape.firstX, cordOfShape.lastY);
            ctx.lineTo(cordOfShape.lastX, cordOfShape.lastY);
            ctx.stroke();
            ctx.fill()
        }
    }


    useEffect(() => {
        if (
            tools === 'straightLine' ||
            tools === 'circle' ||
            tools === 'rectangle' ||
            tools === 'triangle'
        ) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', beginDraw);
            canvas.addEventListener('mouseup', endDraw);
            canvas.addEventListener('mouseleave', endDraw);

            canvas.addEventListener('mousemove', straightLine);
            canvas.addEventListener('mousemove', circle);
            canvas.addEventListener('mousemove', rectangle);
            canvas.addEventListener('mousemove', triangle);

            canvas.addEventListener('touchstart', touchBeginDraw, { passive: true });
            canvas.addEventListener('touchend', touchEndDraw);

            canvas.addEventListener('touchmove', touchStraightLine, { passive: true });
            canvas.addEventListener('touchmove', touchCircle, { passive: true });
            canvas.addEventListener('touchmove', touchRectangle, { passive: true });
            canvas.addEventListener('touchmove', touchTriangle, { passive: true });

            return () => {
                canvas.removeEventListener('mousemove', triangle);
                canvas.removeEventListener('mousemove', straightLine);
                canvas.removeEventListener('mousemove', circle);
                canvas.removeEventListener('mousemove', rectangle);
                canvas.removeEventListener('mousedown', beginDraw);
                canvas.removeEventListener('mouseup', endDraw);
                canvas.removeEventListener('mouseleave', endDraw);

                canvas.removeEventListener('touchstart', touchBeginDraw, { passive: true });
                canvas.removeEventListener('touchend', touchEndDraw);
                canvas.removeEventListener('touchmove', touchStraightLine, { passive: true });
                canvas.removeEventListener('touchmove', touchCircle, { passive: true });
                canvas.removeEventListener('touchmove', touchRectangle, { passive: true });
                canvas.removeEventListener('touchmove', touchTriangle, { passive: true });
            }
        }
    }, [tools, isDrawing, cordOfShape, isShapeFillColorRef, isShapeStrokeColorRef]);
    useEffect(() => {
        bufferCanvasRef.current = document.createElement('canvas');
        bufferCtxRef.current = bufferCanvasRef.current.getContext('2d');
        if (canvasRef.current) {
            bufferCanvasRef.current.width = canvasRef.current.width;
            bufferCanvasRef.current.height = canvasRef.current.height;
        }
    }, [])
    // Text
    const clickOunOfInput = (e) => {
        const canvas = canvasRef.current;
        if (inputTextRef.current && !canvas.contains(e.target)) {
            setShowInput(false);
        }
    }
    const changeOnText = () => {
        setTools('text');
        textRef.current.style.display = 'block'
    }
    const closeTextPanel = (e) => {
        if (textRef.current && !textRef.current.contains(e.target)) {
            textRef.current.style.display = 'none';
        }
    }
    const listenKeys = (e) => {
        if (e.key === 'Enter') {
            if (!inputTextRef.current.value) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const simbols = ['p', 'x', 'v', 'h', 'w'];
            const input = Number([inputTextRef.current.style.fontSize][0].split('').filter(item => !simbols.includes(item)).join(''));
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.globalAlpha = 1;
            ctx.fillStyle = textColorRef.current.value;
            ctx.font = fontRef.current.value;
            ctx.fillText(inputTextRef.current.value, cordText.offsetX, cordText.offsetY + input);
            setShowInput(false);
            return;
        }
    }

    const inputCoordinate = (e) => {
        setCordText(prev => prev = { clientX: e.clientX, clientY: e.clientY, offsetX: e.offsetX, offsetY: e.offsetY });
        setShowInput(true);
    }

    const Input = () => {
        return (
            <input
                ref={inputTextRef}
                type="text"
                className="inputText"
                name="text"
                style={{
                    color: textColorRef.current.value,
                    position: 'absolute',
                    left: `${cordText.clientX}px`,
                    top: `${cordText.clientY}px`,
                    zIndex: 1,
                    font: fontRef.current.value,
                    width: '150px',
                    margin: 0
                }}
                autoFocus />
        )
    }

    const touchInputCoordinate = (e) => {
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        setCordText(prev => prev = { clientX: touch.clientX, clientY: touch.clientY, offsetX: x, offsetY: y });
        setShowInput(true);
    }
    useEffect(() => {
        document.addEventListener('keydown', listenKeys);
        return () => {
            document.removeEventListener('keydown', listenKeys);
        }
    }, [cordText])
    useEffect(() => {
        if (tools !== 'text') return;
        const canvas = canvasRef.current;

        canvas.addEventListener('mouseup', inputCoordinate);
        document.addEventListener('mouseup', closeTextPanel);
        document.addEventListener('mouseup', clickOunOfInput);

        canvas.addEventListener('touchstart', touchInputCoordinate, { passive: true });

        return () => {
            document.removeEventListener('mouseup', closeTextPanel);
            canvas.removeEventListener('mouseup', inputCoordinate);
            document.removeEventListener('mouseup', clickOunOfInput);

            canvas.removeEventListener('touchstart', touchInputCoordinate);
        }
    }, [tools])
    // LinerGradient
    function drawLinerGradient() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferCtx = bufferCtxRef.current;
        const { rect1, rect2 } = cordRectLinerGradient;
        const gradient = ctx.createLinearGradient(rect1.x, rect1.y, rect2.x, rect2.y);
        const step = 1 / (itemLinerGradient.length - 1 || 1);
        itemLinerGradient.forEach((item, index) => {
            gradient.addColorStop(index * step, item.color);
        })
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.drawImage(canvas, 0, 0);
    }
    function drawRectangles(ctx) {
        setTools('linerGradient');
        const { rect1, rect2 } = cordRectLinerGradient;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = 'blue';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'white';
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
        ctx.beginPath();
        ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
        ctx.moveTo(rect1.x + (rect1.width / 2), rect1.y + (rect1.height / 2))
        ctx.lineTo(rect2.x + (rect2.width / 2), rect2.y + (rect2.width / 2))
        ctx.stroke();
    }
    function checkClick(e) {
        const { rect1, rect2 } = cordRectLinerGradient;
        if (tools === 'linerGradient') {
            if (
                e.offsetX > rect1.x &&
                e.offsetX < rect1.x + rect1.width &&
                e.offsetY > rect1.y &&
                e.offsetY < rect1.y + rect1.height
            ) {
                setBlock('linerBlock1');
            } if (
                e.offsetX > rect2.x &&
                e.offsetX < rect2.x + rect2.width &&
                e.offsetY > rect2.y &&
                e.offsetY < rect2.y + rect2.height
            ) {
                setBlock('linerBlock2');
            }
        }
    }

    function moveRectangles(e) {
        const ctx = canvasRef.current.getContext('2d');
        const { rect1, rect2 } = cordRectLinerGradient;
        if (block === 'linerBlock1') {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawLinerGradient();
            ctx.fillStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.fillRect(e.offsetX, e.offsetY, rect1.width, rect1.height);
            ctx.beginPath();
            ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
            ctx.moveTo(rect1.x + (rect1.width / 2), rect1.y + (rect1.height / 2));
            ctx.lineTo(rect2.x + (rect2.width / 2), rect2.y + (rect2.height / 2));
            ctx.stroke();
            setCordRectLinerGradient(prev => ({ ...prev, rect1: { ...prev.rect1, x: e.offsetX, y: e.offsetY } }));
        } if (block === 'linerBlock2') {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawLinerGradient();
            ctx.fillStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.fillRect(e.offsetX, e.offsetY, rect2.width, rect2.height);
            ctx.beginPath();
            ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
            ctx.moveTo(rect1.x + (rect1.width / 2), rect1.y + (rect1.height / 2));
            ctx.lineTo(rect2.x + (rect2.width / 2), rect2.y + (rect2.height / 2))
            ctx.stroke();
            setCordRectLinerGradient(prev => ({ ...prev, rect2: { ...prev.rect2, x: e.offsetX, y: e.offsetY } }));
        }
    }

    function checkTouch(e) {
        if (tools === 'linerGradient') {
            const { rect1, rect2 } = cordRectLinerGradient;
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            if (
                x > rect1.x &&
                x < rect1.x + rect1.width &&
                y > rect1.y &&
                y < rect1.y + rect1.height
            ) {
                setBlock('linerBlock1');
            } if (
                x > rect2.x &&
                x < rect2.x + rect2.width &&
                y > rect2.y &&
                y < rect2.y + rect2.height
            ) {
                setBlock('linerBlock2');
            }
        }
    }

    function toucheMoveRectangles(e) {
        if (tools !== 'linerGradient') return;
        const ctx = canvasRef.current.getContext('2d');
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        let newRect1 = { ...cordRectLinerGradient.rect1 };
        let newRect2 = { ...cordRectLinerGradient.rect2 };

        if (block === 'linerBlock1') {
            newRect1 = { ...newRect1, x, y };
        }
        if (block === 'linerBlock2') {
            newRect2 = { ...newRect2, x, y };
        }

        setCordRectLinerGradient({ rect1: newRect1, rect2: newRect2 });

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const gradient = ctx.createLinearGradient(
            newRect1.x, newRect1.y,
            newRect2.x, newRect2.y
        );
        const step = 1 / (itemLinerGradient.length - 1 || 1);
        itemLinerGradient.forEach((item, index) => {
            gradient.addColorStop(index * step, item.color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        ctx.fillStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.fillRect(newRect1.x, newRect1.y, newRect1.width, newRect1.height);
        ctx.beginPath();
        ctx.fillRect(newRect2.x, newRect2.y, newRect2.width, newRect2.height);
        ctx.moveTo(newRect1.x + newRect1.width / 2, newRect1.y + newRect1.height / 2);
        ctx.lineTo(newRect2.x + newRect2.width / 2, newRect2.y + newRect2.height / 2);
        ctx.stroke();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        function end() {
            setBlock('');
        }

        canvas.addEventListener('mousedown', checkClick);
        canvas.addEventListener('mousemove', moveRectangles);
        canvas.addEventListener('mouseleave', end);
        canvas.addEventListener('mouseup', end);

        canvas.addEventListener('touchstart', checkTouch, { passive: true });
        canvas.addEventListener('touchmove', toucheMoveRectangles, { passive: true });
        canvas.addEventListener('touchend', end);

        return () => {
            canvas.removeEventListener('mousedown', checkClick);
            canvas.removeEventListener('mousemove', moveRectangles);
            canvas.removeEventListener('mouseup', end);
            canvas.removeEventListener('mouseleave', end);

            canvas.removeEventListener('touchstart', checkTouch);
            canvas.removeEventListener('touchmove', toucheMoveRectangles)
            canvas.removeEventListener('touchend', end);
        }
    }, [block, cordRectLinerGradient, tools])
    useEffect(() => {
        drawLinerGradient();
    }, [itemLinerGradient])

    // RadialGradient
    function drawRadialGradient() {
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext('2d');
        const bufferCtx = bufferCtxRef.current;
        const { rect1, rect2 } = cordRectRadialGradient;
        if (!rect1 || !rect2) return;
        const gradient = ctx.createRadialGradient(
            rect1.x + rect1.width / 2, rect1.y + rect1.height / 2, rect1.r,
            rect2.x + rect2.width / 2, rect2.y + rect2.height / 2, rect2.r
        );
        const step = 1 / (itemRadialGradient.length - 1 || 1);
        itemRadialGradient.forEach((item, index) => {
            gradient.addColorStop(index * step, item.color);
        })
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.drawImage(canvas, 0, 0);
    }
    function changeRadius() {
        const canvas = canvasRef.current;
        setCordRectRadialGradient(prev => {
            const { rect1, rect2 } = prev;

            const smallR = Math.sqrt(
                (rect2.x - rect1.x) ** 2 +
                (rect2.y - rect1.y) ** 2
            );

            const bigR = Math.sqrt(
                (canvas.width - rect2.x) ** 2 +
                (canvas.height - rect2.y) ** 2
            );
            return {
                rect1: {
                    ...rect1,
                    r: smallR
                },
                rect2: {
                    ...rect2,
                    r: bigR
                }
            };
        });
    }
    function showRectangles() {
        setTools('RadialGradient')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { rect1, rect2 } = cordRectRadialGradient;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'white';
        ctx.fillStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
        ctx.beginPath();
        ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
        ctx.moveTo(rect1.x, rect1.y);
        ctx.lineTo(rect2.x, rect2.y);
        ctx.stroke();
    }
    function checkCordRectangle(e) {
        const { rect1, rect2 } = cordRectRadialGradient;
        if (tools === 'RadialGradient') {
            if (
                e.offsetX > rect1.x &&
                e.offsetX < rect1.x + rect1.width &&
                e.offsetY > rect1.y &&
                e.offsetY < rect1.y + rect1.height
            ) {
                setBlock('RadialBlock1');
            } if (
                e.offsetX > rect2.x &&
                e.offsetX < rect2.x + rect2.width &&
                e.offsetY > rect2.y &&
                e.offsetY < rect2.y + rect2.height
            ) {
                setBlock('RadialBlock2');
            }
        }
    }
    function changeRadialCoordinates(e) {
        if (block === 'RadialBlock1') {
            setCordRectRadialGradient(prev => ({ ...prev, rect1: { ...prev.rect1, x: e.offsetX, y: e.offsetY } }));
            changeRadius();
        } if (block === 'RadialBlock2') {
            setCordRectRadialGradient(prev => ({ ...prev, rect2: { ...prev.rect2, x: e.offsetX, y: e.offsetY } }));
            changeRadius();
        }
    }
    function drawAll() {
        if (tools !== 'RadialGradient') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { rect1, rect2 } = cordRectRadialGradient;

        drawRadialGradient();
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'blue';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);

        ctx.beginPath();
        ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(rect1.x + (rect1.width / 2), rect1.y + (rect1.height / 2));
        ctx.lineTo(rect2.x + (rect2.width / 2), rect2.y + (rect2.height / 2));
        ctx.stroke();
    }

    function touchChangeRadialCoordinates(e) {
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        if (block === 'RadialBlock1') {
            setCordRectRadialGradient(prev => ({ ...prev, rect1: { ...prev.rect1, x: x, y: y } }));
            changeRadius();
        } if (block === 'RadialBlock2') {
            setCordRectRadialGradient(prev => ({ ...prev, rect2: { ...prev.rect2, x: x, y: y } }));
            changeRadius();
        }
    }

    function touchCheckCordRectangle(e) {
        if (tools === 'RadialGradient') {
            const { rect1, rect2 } = cordRectRadialGradient;
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            if (
                x > rect1.x &&
                x < rect1.x + rect1.width &&
                y > rect1.y &&
                y < rect1.y + rect1.height
            ) {
                setBlock('RadialBlock1');
            } if (
                x > rect2.x &&
                x < rect2.x + rect2.width &&
                y > rect2.y &&
                y < rect2.y + rect2.height
            ) {
                setBlock('RadialBlock2');
            }
        }
    }

    useEffect(() => {
        changeRadius();
    }, [])
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', checkCordRectangle);
        canvas.addEventListener('mousemove', changeRadialCoordinates);

        canvas.addEventListener('touchstart', touchCheckCordRectangle, { passive: true });
        canvas.addEventListener('touchmove', touchChangeRadialCoordinates, { passive: true });
        return () => {
            canvas.removeEventListener('mousedown', checkCordRectangle);
            canvas.removeEventListener('mousemove', changeRadialCoordinates);

            canvas.removeEventListener('touchstart', touchCheckCordRectangle);
            canvas.removeEventListener('touchmove', touchChangeRadialCoordinates);
        }
    }, [block, tools])

    useEffect(() => {
        drawAll();
    }, [cordRectRadialGradient, itemRadialGradient])

    // Pens
    useEffect(() => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (!canvas) {
            return;
        }
        setSavingCanvas(prev => {
            try {
                return prev = [canvas.toDataURL()]
            } catch (e) {
                console.log(e);
            }
        }
        );
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        let drawing = false;
        let prev = { x: 0, y: 0 };

        const checkEffects = () => {
            if (effects.includes("marker")) {
                ctx.globalAlpha = 0.1;
            } if (effects.includes('softStroke')) {
                if (shadowColorRef.current) {
                    ctx.shadowColor = shadowColorRef.current.value;
                }
                ctx.shadowBlur = 7;
            } if (effects.includes('blur')) {
                ctx.filter = 'blur(10px)';
            } if (effects.includes('brightness')) {
                ctx.filter = 'brightness(150%)';
            }
        }

        const mousedown = (e) => {
            drawing = true;
            ctx.beginPath();
            if (tools === 'patterns' || tools === 'thorns') {
                prev = { x: e.offsetX, y: e.offsetY };
            }
            ctx.moveTo(e.offsetX, e.offsetY);
        }
        const mousemove = e => {
            if (drawing) {
                const lineWidth = lineWidthRef.current.value;
                const penColor = colorRef.current.value;
                if (tools === 'pen') {
                    ctx.globalCompositeOperation = 'source-over'
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = penColor;

                    ctx.globalAlpha = 1;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.filter = 'none';
                    checkEffects()

                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke()
                } if (tools === 'pixel') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                    ctx.filter = 'none';
                    ctx.fillStyle = penColor;
                    checkEffects()

                    ctx.fillRect(e.offsetX - lineWidth / 2, e.offsetY - lineWidth / 2, lineWidth, lineWidth);
                } if (tools === 'shadow') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.filter = 'drop-shadow(5px 5px 10px)';
                    ctx.strokeStyle = penColor;
                    ctx.lineWidth = lineWidth;
                    checkEffects()
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke();

                } if (tools === 'eraser') {
                    ctx.lineWidth = lineWidth;
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke()
                } if (tools === 'patterns') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = penColor;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round'
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                    ctx.filter = 'none';
                    checkEffects()

                    const arms = armsRef.current.value;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;

                    const dx = e.offsetX - centerX;
                    const dy = e.offsetY - centerY;

                    const pdx = prev.x - centerX;
                    const pdy = prev.y - centerY;

                    for (let i = 0; i < arms; i++) {
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate((Math.PI * 2 / arms) * i);
                        ctx.beginPath();
                        ctx.moveTo(pdx, pdy);
                        ctx.lineTo(dx, dy);
                        ctx.stroke();
                        ctx.restore();
                    }

                    prev = { x: e.offsetX, y: e.offsetY };
                } if (tools === 'thorns') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = penColor;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round'
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                    ctx.filter = 'none';
                    checkEffects()

                    const rand = Math.floor(Math.random() * 5) + 5;
                    const layers = rand;

                    for (let i = 0; i < layers; i++) {
                        const offset = 10;
                        const dx1 = prev.x + (Math.random() - 0.5) * offset;
                        const dy1 = prev.y + (Math.random() - 0.5) * offset;
                        const dx2 = e.offsetX + (Math.random() - 0.5) * offset;
                        const dy2 = e.offsetY + (Math.random() - 0.5) * offset;

                        ctx.beginPath();
                        ctx.moveTo(dx1, dy1);
                        ctx.lineTo(dx2, dy2);
                        ctx.stroke();
                    }
                    prev = { x: e.offsetX, y: e.offsetY };
                } if (tools === 'spray') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.fillStyle = penColor;
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                    ctx.filter = 'none';
                    checkEffects()

                    const dots = 15;
                    const radius = widthBallsRef.current.value;
                    const x = e.offsetX;
                    const y = e.offsetY;
                    const width = 60;

                    for (let i = 0; i < dots; i++) {
                        const randomX = Math.floor(Math.random() * width) + x - width / 2;
                        const randomY = Math.floor(Math.random() * width) + y - width / 2;
                        ctx.beginPath();
                        ctx.arc(randomX, randomY, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
        const mouseup = () => {
            drawing = false;
            setSavingCanvas(prev => {
                try {
                    const base = wasUndo && undo > 0
                        ? prev.slice(0, prev.length - undo)
                        : prev;

                    if (base !== undefined) {
                        const updated = base.length >= 15 ? base.slice(1) : base;
                        return [...updated, canvas.toDataURL()];
                    } else {
                        return prev;
                    }


                } catch (e) {
                    console.log(e);
                }
            });
            if (wasUndo) {
                setUndo(1);
                setWasUndo(false);
            } else {
                setUndo(1);
            }
            const bufferCtx = bufferCtxRef.current;
            bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
            bufferCtx.drawImage(canvas, 0, 0);
        }
        const mouseleave = () => {
            drawing = false;
        }

        const touchStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            drawing = true;
            ctx.beginPath();
            if (tools === 'patterns' || tools === 'thorns') {
                prev = { x: x, y: y };
            }
            ctx.moveTo(x, y);
        }
        const touchMove = (e) => {
            if (!drawing) return;
            e.preventDefault();
            const touch = e.touches[0];
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            const lineWidth = lineWidthRef.current.value;
            const penColor = colorRef.current.value;
            if (tools === 'pen') {
                ctx.globalCompositeOperation = 'source-over'
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = penColor;

                ctx.globalAlpha = 1;
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.filter = 'none';
                checkEffects()

                ctx.lineTo(x, y);
                ctx.stroke()
            } if (tools === 'pixel') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.filter = 'none';
                ctx.fillStyle = penColor;
                checkEffects()

                ctx.fillRect(x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth);
            } if (tools === 'shadow') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.filter = 'drop-shadow(5px 5px 10px)';
                ctx.strokeStyle = penColor;
                ctx.lineWidth = lineWidth;
                checkEffects()
                ctx.lineTo(x, y);
                ctx.stroke();

            } if (tools === 'eraser') {
                ctx.lineWidth = lineWidth;
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineTo(x, y);
                ctx.stroke()
            } if (tools === 'patterns') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = penColor;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round'
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.filter = 'none';
                checkEffects()

                const arms = armsRef.current.value;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                const dx = x - centerX;
                const dy = y - centerY;

                const pdx = prev.x - centerX;
                const pdy = prev.y - centerY;

                for (let i = 0; i < arms; i++) {
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate((Math.PI * 2 / arms) * i);
                    ctx.beginPath();
                    ctx.moveTo(pdx, pdy);
                    ctx.lineTo(dx, dy);
                    ctx.stroke();
                    ctx.restore();
                }

                prev = { x: x, y: y };
            } if (tools === 'thorns') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = penColor;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round'
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.filter = 'none';
                checkEffects();

                const rand = Math.floor(Math.random() * 5) + 5;
                const layers = rand;

                for (let i = 0; i < layers; i++) {
                    const offset = 10;
                    const dx1 = prev.x + (Math.random() - 0.5) * offset;
                    const dy1 = prev.y + (Math.random() - 0.5) * offset;
                    const dx2 = x + (Math.random() - 0.5) * offset;
                    const dy2 = y + (Math.random() - 0.5) * offset;

                    ctx.beginPath();
                    ctx.moveTo(dx1, dy1);
                    ctx.lineTo(dx2, dy2);
                    ctx.stroke();
                }
                prev = { x: x, y: y };
            } if (tools === 'spray') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = penColor;
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.filter = 'none';
                checkEffects()

                const dots = 15;
                const radius = widthBallsRef.current.value;
                const width = 60;

                for (let i = 0; i < dots; i++) {
                    const randomX = Math.floor(Math.random() * width) + x - width / 2;
                    const randomY = Math.floor(Math.random() * width) + y - width / 2;
                    ctx.beginPath();
                    ctx.arc(randomX, randomY, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        const touchEnd = () => {
            drawing = false;
            const bufferCtx = bufferCtxRef.current;
            bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
            bufferCtx.drawImage(canvas, 0, 0);
        }

        canvas.addEventListener('mousedown', mousedown);
        canvas.addEventListener('mousemove', mousemove);
        canvas.addEventListener('mouseup', mouseup);
        canvas.addEventListener('mouseleave', mouseleave);

        canvas.addEventListener('touchstart', touchStart, { passive: false });
        canvas.addEventListener('touchmove', touchMove, { passive: false });
        canvas.addEventListener('touchend', touchEnd);
        return () => {
            canvas.removeEventListener('mousedown', mousedown);
            canvas.removeEventListener('mousemove', mousemove);
            canvas.removeEventListener('mouseup', mouseup);
            canvas.removeEventListener('mouseleave', mouseleave);

            canvas.removeEventListener('touchstart', touchStart, { passive: false });
            canvas.removeEventListener('touchmove', touchMove, { passive: false });
            canvas.removeEventListener('touchend', touchEnd);
        }
    }, [tools, effects])

    const saveCard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const newCard = { draw: canvas.toDataURL(), id: Date.now() + Math.random(),name: nameOfCardRef.current.value};

        setCards(prev => {
            const updated = prev.length > 16 ? prev : [...prev, newCard].reverse();
            localStorage.setItem('cards', JSON.stringify(updated));
            return updated;
        });

        exit('cards');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    return (
        <>
            <div id="wrapperOfCustomCard">
                <button onClick={() => exit('main')} id="backToMain">
                    <img src="/Bankapp/arrow.png" alt="addCard" />
                </button>
                <button onClick={() => addNewCardRef.current.style.display = 'flex'} id="addCard">
                    <img src="/Bankapp/addIcon.png" alt="addCard" />
                </button>
                <input ref={nameOfCardRef} id="nameOfCard" type="text" placeholder="Name of card" />
                <AddCustomCardPanel
                    addNewCardRef={addNewCardRef}
                    setCards={setCards} exitPage={exit}
                    saveCard={saveCard}
                />
                <ShapesPanel
                    shapesPanelRef={shapesPanelRef}
                    setTools={setTools}
                    shapesStrokeColorRef={shapesStrokeColorRef}
                    shapesFillColorRef={shapesFillColorRef}
                    isShapeStrokeColorRef={isShapeStrokeColorRef}
                    isShapeFillColorRef={isShapeFillColorRef}
                    isCheckedFill={isCheckedFill}
                    setIsCheckedFill={setIsCheckedFill}
                    isCheckedStroke={isCheckedStroke}
                    setIsCheckedStroke={setIsCheckedStroke}
                />
                {showInput && <Input />}
                <PenPanel
                    setEffects={setEffects}
                    setTools={setTools}
                    tools={tools}
                    effects={effects}
                    shadowColorRef={shadowColorRef}
                    pensPanelRef={pensPanelRef}
                    armsRef={armsRef}
                    widthBallsRef={widthBallsRef}
                />
                <TextPanel fontRef={fontRef} textColorRef={textColorRef} textRef={textRef} />
                <Background
                    backgroundRef={backgroundRef}
                    setBackgroundColor={setBackgroundColor}
                    backgroundColor={backgroundColor}
                    itemLinerGradient={itemLinerGradient}
                    setItemLinerGradient={setItemLinerGradient}
                    drawRectangles={() => drawRectangles(canvasRef.current.getContext('2d'))}
                    itemRadialGradient={itemRadialGradient}
                    setItemRadialGradient={setItemRadialGradient}
                    drawLinerGradient={drawLinerGradient}
                    drawRadialRectangles={showRectangles}
                    drawRadialGradient={drawRadialGradient}
                    setTools={setTools}
                />
                <div id="wrapperCanvas">
                    <canvas ref={canvasRef} width={500} height={240}></canvas>
                </div>
                <footer id="toolsWrapper">
                    <input ref={lineWidthRef} min={1} max={50} id="lineWidthRange" type="range" />
                    <input ref={colorRef} id="colorInput" type="color" />
                    <div id="tools">
                        <>
                            <input type="radio" name="item" id="bg" />
                            <label onClick={() => { backgroundRef.current.style.display = 'block' }} className="toolsEl" htmlFor="bg">Bg</label>

                            <input type="radio" name="item" id="pens" />
                            <label onClick={() => { pensPanelRef.current.style.display = 'block'; }} className="toolsEl" htmlFor="pens">Pens</label>

                            <input type="radio" name="item" id="shapes" />
                            <label onClick={() => { shapesPanelRef.current.style.display = 'block' }} className="toolsEl" htmlFor="shapes">Shapes</label>

                            <input type="radio" name="item" id="text" />
                            <label className="toolsEl" htmlFor="text" onClick={changeOnText}>Text</label>

                            <input type="radio" name="item" id="clear" />
                            <label className="toolsEl" htmlFor="clear" onClick={clearHandler} defaultChecked>Clear</label>

                            <input type="radio" name="item" id="back" />
                            <label className="toolsEl" htmlFor="back" onClick={() => back(canvasRef, savingCanvas, undo, setUndo, setWasUndo)}>Back</label>
                        </>
                    </div>
                </footer>
            </div>
        </>
    )
}

