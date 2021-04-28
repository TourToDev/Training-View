import React, { useEffect, useState } from 'react';
import HeaderText from '../HeaderText';

import "./index.less"
export default function TrainingLoad() {
    const [trainingLoad, setTrainingLoad] = useState({
        CTL:0,
        ATL:0,
        TSB:0,
    })

    useEffect(async () => {
        const res = await fetch("/userBasic/trainingLoad",{
            mode:"cors",
            credentials:"include"
        });
        const trainingLoad = await res.json();
        setTrainingLoad(trainingLoad)
    }, []);


    return (
        <div className="tv-app-trainingLoad">
            <HeaderText>
                Training Load
            </HeaderText>
            <div>
                <h2>
                CTL – Chronic Training Load | Fitness
                </h2>
                <p>
                    Current CTL : <span> {trainingLoad.CTL} </span>
                </p>
                
            </div>
            <div>
                <h2>
                ATL – Acute Training Load | Fatigue
                </h2>
                <p>
                Current ATL : <span> {trainingLoad.ATL} </span>
                </p>
            </div>
            <div>
                <h2>
                TSB – Training Stress Balance
                </h2>
                <p>
                Current TSB : <span> {trainingLoad.TSB} </span>
                </p>
            </div>
        </div>
    )
}
