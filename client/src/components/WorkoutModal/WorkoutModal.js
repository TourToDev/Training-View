import { Formik,Form,Field} from 'formik';
import React, { PureComponent, useReducer, useRef, useEffect, useState} from 'react'
import { useSelector ,useDispatch} from 'react-redux';
import { fetchBasicWorkouts, fetchWeeklyWorkouts } from '../../features/workoutsCollection/workoutsCollectionSlice';
import { trimTo2Digit } from '../../lib/numberUtils';
import { secondsToHms, hmsToSecond } from '../../lib/timeUtils';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

import "./index.less";
import * as Recharts from "recharts";
import WorkoutForm from './WorkoutForm';
import ModalHeader from './ModalHeader';
const {
        ComposedChart, 
        BarChart, 
        Bar, 
        Line, 
        XAxis, 
        YAxis, 
        CartesianGrid, 
        Tooltip, 
        Legend, 
        ResponsiveContainer,
        Area
    } = Recharts;



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


    const header = <ModalHeader
                        reducerState={state}
                        modalMode={modalMode}
                        setModalMode={setModalMode}
                        setWorkoutId={setWorkoutId}
                        date = {date}                        
                    />;
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
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

    // const workoutForm = (
    //     <div className="tv-workoutmodal-body">
    //         <div className="tv-workoutmodal-fieldtypes">
    //             <span>Planned</span>
    //             <span>Completed</span>
    //         </div>

    //         <Formik
    //         innerRef={formRef}
    //         enableReinitialize={true}
    //         initialValues={formInitialState}
    //         onSubmit={async values=>{
                
    //             const data = {...values};
    //             data.plannedDuration = hmsToSecond(data.plannedDuration);
    //             data.duration = hmsToSecond(data.duration);
    //             console.log(JSON.stringify(data));
    //             const payload = {
    //                 status:data.duration? "completed" : "planned",
    //                 workoutTimestamp:data.workoutTimestamp,
    //                 planned:{
    //                     duration: data.plannedDuration,
    //                     elevation_gain: data.plannedElevationGain,
    //                     distance: data.plannedDistance,
    //                     TSS: data.plannedTSS,
    //                     IF: data.plannedIF,
    //                     avg_speed: data.plannedAvgSpeed,
    //                     NP:data.plannedNP,

    //                 },
    //                 basic:{
    //                     FTP,
    //                     duration:data.duration,
    //                     elevation_gain:data.elevation_gain,
    //                     distance:data.distance,
    //                     avg_speed:data.avg_speed,
    //                     max_speed:undefined,
    //                     avg_cadence:undefined,
    //                     max_cadence:undefined,
    //                     avg_heart_rate:undefined,
    //                     max_heart_rate:undefined,
    //                 },
    //                 power:{
    //                     avg_power:data.avg_power,
    //                     max_power:data.max_power,
    //                     NP:data.NP,
    //                     TSS:data.TSS,
    //                     IF:data.IF,
    //                     VI:data.NP/data.avg_power,
    //                 },
    //             }
    //             dispatch({
    //                 type:"update",
    //                 payload:payload,
    //             });
    //             //console.log(state)
                
    //             if (workoutId) {
    //                 const res = await fetch("http://localhost:3000/workoutsCollection/edit/basic/"+workoutId,{
    //                     method:"post",
    //                     mode:"cors",
    //                     credentials:"include",
    //                     headers: {
    //                         'Accept': 'application/json',
    //                         'Content-Type': 'application/json'
    //                         },
    //                     body: JSON.stringify(payload)
    //                 });
    //                 const resText = await res.json();
    //             } else {
    //                 const res = await fetch("http://localhost:3000/workoutsCollection/add/basic",{
    //                     method:"post",
    //                     mode:"cors",
    //                     credentials:"include",
    //                     headers: {
    //                         'Accept': 'application/json',
    //                         'Content-Type': 'application/json'
    //                         },
    //                     body: JSON.stringify(payload)
    //                 });
    //                 const resWorkoutId = await res.text();
    //             }
    //             reduxDispatch(fetchWeeklyWorkouts());
    //             reduxDispatch(fetchBasicWorkouts());
    //         }}
    //     >
    //         <Form style={{}}>
    //             <div className="tv-workoutmodal-formlabels">
    //                 <span>Duration</span>
    //                 <span>Distance</span>
    //                 <span>Average Speed</span>
    //                 <span>Elevation Gain</span>
    //                 <span>TSS</span>
    //                 <span>IF</span>
    //                 <span>Normalized Power</span>
    //             </div>
    //             <div className="tv-workoutmodal-forminputs">
    //                 <Field type="text" name="plannedDuration"/>
    //                 <Field type="number" name="plannedDistance"/>
    //                 <Field type="number" name="plannedAvgSpeed" disabled/>
    //                 <Field type="number" name="plannedElevationGain"/>
    //                 <Field type="number" name="plannedTSS"/>
    //                 <Field type="number" name="plannedIF"/>
    //                 <Field type="number" name="plannedNP" disabled/>
    //             </div>
    //             <div className="tv-workoutmodal-forminputs">
    //                 <Field type="text" name="duration"/>
    //                 <Field type="number" name="distance"/>
    //                 <Field type="number" name="avg_speed"/>
    //                 <Field type="number" name="elevation_gain"/>
    //                 <Field type="number" name="TSS"/>
    //                 <Field type="number" name="IF"/>
    //                 <Field type="number" name="NP"/>
    //             </div>

    //             <div className="tv-workoutmodal-fieldtypes">
    //                 <span>Min</span>
    //                 <span>Average</span>
    //                 <span>Max</span>
    //             </div>

    //             <div className="tv-workoutmodal-formlabels-2">
    //                 <span>Power</span>
    //             </div>

    //             <div className="tv-workoutmodal-forminputs-row">
    //                 <Field type="number" name="min_power"/>
    //                 <Field type="number" name="avg_power"/>
    //                 <Field type="number" name="max_power"/>
    //             </div>
    //         </Form>
    //     </Formik>
    //     </div>
    // )

    const [chartData, setChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    useEffect(() => {
        if (workoutId) {
            fetch("http://localhost:3000/workoutsCollection/get/detail/"+workoutId,{
                mode:"cors",
                credentials:"include",
            })
            .then(res => {
              console.log("Getting response")
              return res.json();  
            })
            .then(data => setChartData(data))
    
            fetch("http://localhost:3000/workoutsCollection/get/detail/zonePercent/"+workoutId,{
                mode:"cors",
                credentials:"include",
            })
            .then(res => {
              console.log("Getting response")
              return res.json();  
            })
            .then(data => setBarChartData(data))
        }
    }, [workoutId]);

    const analysis = (
        <div style={{height:"600px",overflow:"auto"}}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="seconds" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="speed" stroke="#8884d8" dot={false} connectNulls />
                    <Line type="monotone" dataKey="power" stroke="#413ea0" dot={false} connectNulls />
                    <Line type="monotone" dataKey="heart_rate" stroke="red" dot={false} connectNulls />
                    {/* <Line type="monotone" dataKey="altitude" stroke="green" dot={false} connectNulls /> */}
                    <Area type="monotone" dataKey="altitude" stroke="#82ca9d" connectNulls />
                </ComposedChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={barChartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percent" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

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
                analysis 
                :
                <WorkoutForm 
                    workoutId={workoutId}  
                    formRef={formRef} 
                    date={date} 
                    reducerState={state} 
                    dispatch={dispatch}
                />
             }
        </Modal>
    );
}