import { Formik,Form,Field} from 'formik';
import React, { useEffect, useState} from 'react'
import { useSelector ,useDispatch} from 'react-redux';
import { fetchBasicWorkouts, fetchWeeklyWorkouts } from '../../features/workoutsCollection/workoutsCollectionSlice';
import { trimTo2Digit } from '../../lib/numberUtils';
import { secondsToHms, hmsToSecond } from '../../lib/timeUtils';
import { Spin } from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

export default function WorkoutForm({workoutId, formRef, date, reducerState, dispatch}) {
    const [formLoading, setFormLoading] = useState(false);

    const FTP = useSelector(state => state.user.basicInfo.FTP)
    const state = reducerState;
    const reduxDispatch = useDispatch();
    var formInitialState = {
        status:"planned",
        workoutTimestamp:date,
        plannedDuration:secondsToHms(state.planned.duration),
        plannedDistance:state.planned.distance,
        plannedAvgSpeed:trimTo2Digit(state.planned.distance/state.planned.duration * 3600)|| state.planned.avg_speed,
        plannedElevationGain:state.planned.elevation_gain,
        plannedTSS:state.planned.TSS,
        plannedIF:state.planned.IF,
        plannedNP:trimTo2Digit(state.planned.IF*FTP) || 0,
        duration: secondsToHms(state.basic.duration),
        distance: state.basic.distance,
        avg_speed: trimTo2Digit(state.basic.distance / state.basic.duration * 3600),
        elevation_gain:state.basic.elevation_gain,
        TSS:state.power.TSS,
        IF:state.power.IF,
        NP: trimTo2Digit(state.power.IF * state.basic.FTP),
        min_power:"",
        avg_power:state.power.avg_power,
        max_power:state.power.max_power,
    }

    useEffect(async () => {
        if (workoutId) {
            console.log("begin fetching basic workout:" + workoutId)
            dispatch({
                type:"reset",
            })
            setFormLoading(true);
            const res = await fetch(
                "http://localhost:3000/workoutsCollection/get/basic/" + workoutId,
                {
                    mode:"cors",
                    credentials:"include"
            });
            const data = await res.json();
        
            let status = "planned";
            if (data.basic) {
                if (data.basic.duration) {
                    status = "completed";
                }
            }
            dispatch({
                type:"update",
                payload:{...data,status:status},
            })
            setFormLoading(false);
        } else {
            dispatch({
                type:"reset",
            })
        }
    }, [workoutId])

    return (
        <div className="tv-workoutmodal-body">
            <Spin spinning={formLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }}/>}>
                <div className="tv-workoutmodal-fieldtypes">
                    <span>Planned</span>
                    <span>Completed</span>
                </div>

                <Formik
                innerRef={formRef}
                enableReinitialize={true}
                initialValues={formInitialState}
                onSubmit={async values=>{
                    const data = {...values};
                    data.plannedDuration = hmsToSecond(data.plannedDuration);
                    data.duration = hmsToSecond(data.duration);
                    console.log(JSON.stringify(data));
                    const payload = {
                        status:data.duration? "completed" : "planned",
                        workoutTimestamp:data.workoutTimestamp,
                        planned:{
                            duration: data.plannedDuration,
                            elevation_gain: data.plannedElevationGain,
                            distance: data.plannedDistance,
                            TSS: data.plannedTSS,
                            IF: data.plannedIF,
                            avg_speed: data.plannedAvgSpeed,
                            NP:data.plannedNP,

                        },
                        basic:{
                            FTP,
                            duration:data.duration,
                            elevation_gain:data.elevation_gain,
                            distance:data.distance,
                            avg_speed:data.avg_speed,
                            max_speed:undefined,
                            avg_cadence:undefined,
                            max_cadence:undefined,
                            avg_heart_rate:undefined,
                            max_heart_rate:undefined,
                        },
                        power:{
                            avg_power:data.avg_power,
                            max_power:data.max_power,
                            NP:data.NP,
                            TSS:data.TSS,
                            IF:data.IF,
                            VI:data.NP/data.avg_power,
                        },
                    }
                    dispatch({
                        type:"update",
                        payload:payload,
                    });
                    //console.log(state)
                    
                    if (workoutId) {
                        const res = await fetch("http://localhost:3000/workoutsCollection/edit/basic/"+workoutId,{
                            method:"post",
                            mode:"cors",
                            credentials:"include",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                            body: JSON.stringify(payload)
                        });
                        const resText = await res.json();
                    } else {
                        const res = await fetch("http://localhost:3000/workoutsCollection/add/basic",{
                            method:"post",
                            mode:"cors",
                            credentials:"include",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                            body: JSON.stringify(payload)
                        });
                        const resWorkoutId = await res.text();
                    }
                    reduxDispatch(fetchWeeklyWorkouts());
                    reduxDispatch(fetchBasicWorkouts());
                }}
            >
                <Form style={{}}>
                    <div className="tv-workoutmodal-formlabels">
                        <span>Duration</span>
                        <span>Distance</span>
                        <span>Average Speed</span>
                        <span>Elevation Gain</span>
                        <span>TSS</span>
                        <span>IF</span>
                        <span>Normalized Power</span>
                    </div>
                    <div className="tv-workoutmodal-forminputs">
                        <Field type="text" name="plannedDuration"/>
                        <Field type="number" name="plannedDistance"/>
                        <Field type="number" name="plannedAvgSpeed" disabled/>
                        <Field type="number" name="plannedElevationGain"/>
                        <Field type="number" name="plannedTSS"/>
                        <Field type="number" name="plannedIF"/>
                        <Field type="number" name="plannedNP" disabled/>
                    </div>
                    <div className="tv-workoutmodal-forminputs">
                        <Field type="text" name="duration"/>
                        <Field type="number" name="distance"/>
                        <Field type="number" name="avg_speed"/>
                        <Field type="number" name="elevation_gain"/>
                        <Field type="number" name="TSS"/>
                        <Field type="number" name="IF"/>
                        <Field type="number" name="NP"/>
                    </div>

                    <div className="tv-workoutmodal-fieldtypes">
                        <span>Min</span>
                        <span>Average</span>
                        <span>Max</span>
                    </div>

                    <div className="tv-workoutmodal-formlabels-2">
                        <span>Power</span>
                    </div>

                    <div className="tv-workoutmodal-forminputs-row">
                        <Field type="number" name="min_power"/>
                        <Field type="number" name="avg_power"/>
                        <Field type="number" name="max_power"/>
                    </div>
                </Form>
            </Formik>
            </Spin>
        </div>
    )
}






