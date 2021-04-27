import React, {  useReducer, useRef, useEffect, useState} from 'react'

import Button from '../Button/Button';
import Modal from '../Modal/Modal';

import "./index.less";
import WorkoutForm from './WorkoutForm';
import ModalHeader from './ModalHeader';
import AnalysisChart from './AnalysisChart';



const initialState = {
    status:"planned",
    workoutTimestamp:"",
    planned:{
        duration: "",
        elevation_gain: "",
        distance: "",
        avg_speed:"",
        TSS: "",
        IF: "",
        NP:"",

    },
    basic:{
        FTP:"",
        duration:"",
        elevation_gain:"",
        distance:"",
        avg_speed:"",
        max_speed:"",
        avg_cadence:"",
        max_cadence:"",
        avg_heart_rate:"",
        max_heart_rate:"",
    },
    power:{
        avg_power:"",
        max_power:"",
        NP:"",
        TSS:"",
        IF:"",
        VI:"",
    },
}

const reducer = (state, action) => {
    switch (action.type) {
        case "update":
            return ({
                ...state, ...action.payload
            })
        case "reset":
            return ({...initialState})
        default:
            break;
    }
}

export default function WorkoutModal({
    workoutId, 
    date,
    setWorkoutId,
    visible, 
    setVisible,
    onClose, 
}) {
    const [modalMode, setModalMode] = useState("workout-form");
    const [state, dispatch] = useReducer(reducer, initialState);
    const formRef = useRef();
    console.log(date)

    const header = <ModalHeader
                        reducerState={state}
                        modalMode={modalMode}
                        setModalMode={setModalMode}
                        setWorkoutId={setWorkoutId}
                        date = {date}                        
                    />;

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    }
    
    const footer = (
        <div 
            className="tv-app-userinfo-footer" 
            style={{backgroundColor:"#ccc"}}
        >
          <Button onClick={()=>setVisible(false)}>Cancel</Button>
          <Button onClick={()=>handleSubmit()}
          >
                Save
            </Button>
          <Button onClick={()=>{
            handleSubmit();
            setVisible(false)
            }}>
                Save&Close
          </Button>       
        </div>
      );

    return (
        <Modal className="tv-workoutmodal" 
                visible={visible} 
                onClose={onClose} 
                header={header} 
                footer={footer}
                bodyStyle={{width:"732px",maxWidth:"732px"}}
        >
            {
            modalMode==="analysis"? 
                <AnalysisChart workoutId={workoutId}/>
                :
                <WorkoutForm 
                    workoutId={workoutId} 
                    setWorkoutId={setWorkoutId} 
                    formRef={formRef} 
                    date={date} 
                    reducerState={state} 
                    dispatch={dispatch}
                />
             }
        </Modal>
    );
}