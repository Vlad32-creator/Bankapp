import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";


export const AddCustomCardPanel = ({addNewCardRef,saveCard }) => {
    useEffect(() => {
        addNewCardRef.current.style.display = 'none';
        document.addEventListener('mouseup',exit);
        return () => {
            document.removeEventListener('mouseup',exit);
        }
    },[]);

    const exit = (e) => {
        if (addNewCardRef.current && !addNewCardRef.current.contains(e.target)) {
            addNewCardRef.current.style.display = 'none';
        }
    }

    return (
        <div ref={addNewCardRef} id="addCustomCardWrapper" >
            <h3>
                You want to add a new card?
            </h3>
            <div>
                <button onClick={() => addNewCardRef.current.style.display = 'none'}>No</button>
                <button onClick={saveCard}>Yes</button>
            </div>
        </div>
    )
}

export const ShapesPanel = ({
    shapesPanelRef, setTools, shapesStrokeColorRef,
    shapesFillColorRef, isShapeStrokeColorRef, isShapeFillColorRef,
    isCheckedFill, setIsCheckedFill,
    isCheckedStroke, setIsCheckedStroke
}) => {

    const changeFill = () => {
        setIsCheckedFill(prev => !prev);
    }
    const changeStroke = () => {
        setIsCheckedStroke(prev => !prev);
    }
    const clickOutside = (e) => {
        if (shapesPanelRef.current && !shapesPanelRef.current.contains(e.target)) {
            shapesPanelRef.current.style.display = 'none';
        }
    }
    useEffect(() => {
        shapesPanelRef.current.style.display = 'none';
        document.addEventListener('mouseup', clickOutside)
        return () => {
            document.removeEventListener('mouseup', clickOutside);
        }
    }, [])
    return (
        <div ref={shapesPanelRef} id="shapesPanelWrapper">
            <h3>Shapes</h3>
            <main>
                <button onClick={() => setTools('rectangle')}>
                    <img src="./customCard/Rectangle.png" alt="Rectangle" />
                </button>
                <button onClick={() => setTools('circle')}>
                    <img src="./customCard/Circle.png" alt="Circle" />
                </button>
                <button onClick={() => setTools('triangle')}>
                    <img src="./customCard/Triangle.png" alt="Triangle" />
                </button>
                <button onClick={() => setTools('straightLine')}>
                    <img src="./customCard/StraightLine.png" alt="Straight Line" />
                </button>

            </main>
            <footer>
                <div>
                    <span>Stroke color:</span>
                    <input ref={shapesStrokeColorRef} type="color" />
                    <input ref={isShapeStrokeColorRef} onChange={changeStroke} type="checkbox" checked={isCheckedStroke} />
                </div>
                <div>
                    <span>Fill color</span>
                    <input ref={shapesFillColorRef} type="color" />
                    <input ref={isShapeFillColorRef} onChange={changeFill} type="checkbox" checked={isCheckedFill} />
                </div>
            </footer>
        </div>
    )
}
export const back = (canvasRef, savingCanvas, undo, setUndo, setWasUndo) => {
    if (savingCanvas && savingCanvas.length - undo > 0) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = savingCanvas[savingCanvas.length - undo - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        setUndo(prev => prev + 1);
        setWasUndo(true);
    }
}

export const PenPanel = ({
    setEffects, setTools, tools, effects, shadowColorRef, pensPanelRef, armsRef, widthBallsRef
}) => {
    const checkEffects = function (e) {
        const effect = e.currentTarget.id;
        setEffects(prev => {
            if (prev.includes(effect)) {
                const newPrev = prev.filter(item => item !== effect);
                return [...newPrev, effect];
            } else {
                return [...prev, effect];
            }
        });
    }

    const clickOutside = (e) => {
        if (pensPanelRef.current && !pensPanelRef.current.contains(e.target)) {
            pensPanelRef.current.style.display = 'none';
        }
    }


    useEffect(() => {
        pensPanelRef.current.style.display = 'none';
        document.addEventListener('mouseup', clickOutside);
        return () => {
            document.removeEventListener('mouseup', clickOutside);
        };
    }, [])

    return (
        <>
            <div id="wrapperPenPanel" ref={pensPanelRef}>
                <h4 style={{ color: 'rgb(230,202,202', margin: '20px' }}>Brushes</h4>
                <div id="brushes">
                    <button className="penPanelItem" onClick={() => setTools('pen')}>
                        <img className="penPanelImg" src="./customCard/pen.png" alt="pen" />
                    </button>
                    <button className="penPanelItem" onClick={() => setTools('shadow')}>
                        <img className="penPanelImg" src="./customCard/lineShadow.png" alt="lineShadow" />
                    </button>
                    <button className="penPanelItem" onClick={() => setTools('pixel')}>
                        <img className="penPanelImg" src="./customCard/pixels.png" alt="pixels" />
                    </button>
                    <button className="penPanelItem" onClick={() => setTools('patterns')}>
                        <img className="penPanelImg" src="./customCard/patterns.png" alt="patterns" />
                    </button>
                    <button className="penPanelItem" onClick={() => setTools('thorns')}>thorns</button>
                    <button className="penPanelItem" onClick={() => setTools('spray')}>
                        <img className="penPanelImg" src="./customCard/spray.png" alt="spray" />
                    </button>
                    <button className="penPanelItem" onClick={() => setTools('eraser')}>
                        <img className="penPanelImg" src="./customCard/eraser.png" alt="" />
                    </button>
                </div>

                <div id="customizeBrushes">
                    {tools === 'patterns' &&
                        <>
                            <p>Arms</p>
                            <input max={30} min={2} ref={armsRef} type="range" />
                        </>
                    }
                    {tools === 'spray' &&
                        <>
                            <p>Width of balls</p>
                            <input ref={widthBallsRef} type="range" min={1} max={20} />
                        </>
                    }
                </div>

                <h4 style={{ color: 'rgb(230,202,202' }}>Effects</h4>
                <div id="effects">
                    <button className="penPanelItem" onClick={() => setEffects([])}>none</button>
                    <button className="penPanelItem" id="marker" onClick={checkEffects}>marker</button>
                    <button className="penPanelItem" id="blur" onClick={checkEffects}>blur</button>
                    <button className="penPanelItem" id="softStroke" onClick={checkEffects}>softStroke</button>
                    <button className="penPanelItem" id="brightness" onClick={checkEffects}>brightness</button>
                </div>

                <div>
                    {effects[effects.length - 1] === 'softStroke' &&
                        <>
                            <input type="color" ref={shadowColorRef} />
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export const Background = ({
    backgroundRef, backgroundColor, setBackgroundColor,
    itemLinerGradient, setItemLinerGradient, drawRectangles,
    itemRadialGradient, setItemRadialGradient, drawLinerGradient,
    drawRadialRectangles, drawRadialGradient, setTools
}) => {
    const [background, setBackground] = useState('color');
    const colorContainerRef = useRef();

    const clickOutside = (e) => {
        if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
            backgroundRef.current.style.display = 'none';
        }
    }
    // LinerGradient
    const addLinerColor = () => {
        setItemLinerGradient(prev => {
            return prev.length === 0 ? [{ color: '#FFFFFF', id: 1 }] : [...prev, { color: '#FFFFFF', id: Date.now() + Math.random() }];
        })
    }
    const deleteLinerColor = (id) => {
        setItemLinerGradient(prev => {
            return prev.filter(item => item.id !== id);
        })
    }
    const changeLinerColor = (id, newColor) => {
        setItemLinerGradient(prev => prev.map(item => item.id === id ? { ...item, color: newColor } : item));
    }
    // RadialGradient
    const addRadialColor = () => {
        setItemRadialGradient(prev => {
            return prev.length === 0 ? [{ color: '#FFFFFF', id: 1 }] : [...prev, { color: '#FFFFFF', id: Date.now() + Math.random() }];
        })
        setTools('RadialGradient');
    }
    const deleteRadialColor = (id) => {
        setItemRadialGradient(prev => {
            return prev.filter(item => item.id !== id);
        })
    }
    const changeRadialColor = (id, newColor) => {
        setItemRadialGradient(prev => prev.map(item => item.id === id ? { ...item, color: newColor } : item));
    }

    useEffect(() => {
        backgroundRef.current.style.display = 'none';
        document.addEventListener('mouseup', clickOutside);
        return () => {
            document.removeEventListener('mouseup', clickOutside);
        }
    }, [])

    return (
        <>
            <div ref={backgroundRef} id="backgroundTools">
                <header>
                    <button className="bgTools" onClick={() => setBackground('color')} title="color">
                        <img src="./Bankapp/customCard/Rectangle.png" alt="color" />
                    </button>
                    <button className="bgTools" onClick={() => setBackground('liner')} title="linerGradient">
                        <img src="./Bankapp/customCard/linerGradient.png" alt="linerGradient" />
                    </button>
                    <button className="bgTools" onClick={() => setBackground('radial')} title="radialGradient">
                        <img src="./Bankapp/customCard/radialGradient.png" alt="radialGradient" />
                    </button>
                </header>
                <main>
                    {background === 'color' &&
                        <HexColorPicker id="hexPanel" style={{ width: "100%", height: '100%' }} color={backgroundColor} onChange={setBackgroundColor} />
                    }
                    {background === 'liner' &&
                        <div className="wrapperGradient">
                            <button onClick={drawRectangles} className="vectorGradient">cord</button>
                            <button onClick={drawLinerGradient} className="saveGradient">save</button>
                            <button onClick={addLinerColor} id="addLinerGradientBtn">
                                <h3>
                                    Liner Gradient
                                    <img className="addGradientImg" src="/Bankapp/addIcon.png" alt="addColor" />
                                </h3>
                            </button>

                            <ul className="listOfColors" ref={colorContainerRef}>
                                {Array.isArray(itemLinerGradient) && itemLinerGradient.map((item) => (
                                    <li key={item.id}>
                                        <button style={{ background: 'transparent', marginRight: '5px', border: 'none' }} onClick={() => deleteLinerColor(item.id)}>❌</button>
                                        <input className={item.id} onChange={(e) => changeLinerColor(item.id, e.target.value)} type="color" value={item.color} />
                                        <span >{item.color}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    }{background === 'radial' &&
                        <div className="wrapperGradient">
                            <button onClick={drawRadialRectangles} className="vectorGradient">cord</button>
                            <button onClick={drawRadialGradient} className="saveGradient">save</button>
                            <button onClick={addRadialColor} id="addLinerGradientBtn">
                                <h3>
                                    Radial Gradient
                                    <img className="addGradientImg" src="/Bankapp/addIcon.png" alt="addColor" />
                                </h3>
                            </button>

                            <ul className="listOfColors" ref={colorContainerRef}>
                                {Array.isArray(itemRadialGradient) && itemRadialGradient.map((item) => (
                                    <li key={item.id}>
                                        <button style={{ background: 'transparent', marginRight: '5px', border: 'none' }} onClick={() => deleteRadialColor(item.id)}>❌</button>
                                        <input className={item.id} onChange={(e) => changeRadialColor(item.id, e.target.value)} type="color" value={item.color} />
                                        <span >{item.color}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </main>
            </div>
        </>
    )
}
export const TextPanel = ({ fontRef, textColorRef, textRef }) => {
    const [font, setFont] = useState('20px Arial');
    useEffect(() => {
        textRef.current.style.display = 'none';
    }, [])
    const inputChange = (e) => {
        setFont(prev => prev = e.target.value);
    }
    return (
        <div ref={textRef} id="textWrapper">
            <h3>Text</h3>
            <input ref={fontRef} onChange={inputChange} value={font} type="text" />
            <input ref={textColorRef} type="color" />
        </div>
    )
}