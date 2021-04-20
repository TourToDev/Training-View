import "./index.less";

import React, { useState } from 'react'
import HeaderText from '../HeaderText'
import WorkoutModal from "../WorkoutModal/WorkoutModal";
import { useSelector } from "react-redux";
import { secondsToHms } from "../../lib/timeUtils";

export default function TodayInfo() {
    const powerInfo = useSelector(state => state.user.powerInfo);
    const workoutsCollection = useSelector(todayWorkout => todayWorkout.workoutsCollection.workoutsCollection)
    const todayWorkout = workoutsCollection.filter( (workout) => {
        if (!workout.workoutTimestamp) {
            return false;
        }
        const workoutDate =  new Date(workout.workoutTimestamp);
        const today = new Date();
        return (
            workoutDate.getFullYear() === today.getFullYear()
            && workoutDate.getDate() === today.getDate()
        );
    })[0];
    const todayWorkoutId = todayWorkout? todayWorkout.workoutId : null;
    const todayWorkoutTime = todayWorkout? todayWorkout.workoutTimestamp : null;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalDate, setModalDate] = useState(null);

    const emptyCard = (
        <div className="tv-app-today-emptycard">
            <p className="tv-app-today-tip">You have no scheduled workouts today.</p>
            <button className="btn-outlined" onClick={
                () => {
                    setModalDate( new Date().getTime() )
                    setModalVisible(true);
                }}>Add a Workout</button>
        </div>
    );
    const trainingZones = useSelector(state => state.user.powerInfo.trainingZones);

    const workoutCard = 
    todayWorkoutId?
    (
        <div 
            onClick={() => {
                setModalDate(todayWorkoutTime);
                setModalVisible(true);
            }}
        >
            <div className="tv-workoutmodal-briefcard todayinfocard" style={{
                }}>
                <span className="key-stats">
                    {todayWorkout.basic.duration? secondsToHms(todayWorkout.basic.duration) : "--:--:--"}
                </span>
                <span className="key-stats">
                    {todayWorkout.basic.distance? todayWorkout.basic.distance : "--"} <small>KM</small>
                </span>
                <span className="key-stats">
                    {todayWorkout.power.TSS? todayWorkout.power.TSS : "--"} <small>TSS</small>
                </span>
            </div>

            <div >
                <span className="tv-app-today-tip" style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign:"center",
                    marginTop: "5em",
                    }}>
                    <b>Today's Training Zones</b>
                    <p style={{
                        marginBottom:0,
                        color:"#5a0792",
                        fontWeight:"bold",
                    }}>Power</p>
                    <p>Threshold: {powerInfo.FTP} W</p>
                    <div className="zones"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "1em"
                        }}
                    >
                        <div className="zoneNames">
                            <div className="zoneName">7</div>
                            <div className="zoneName">6</div>
                            <div className="zoneName">5</div>
                            <div className="zoneName">4</div>
                            <div className="zoneName">3</div>
                            <div className="zoneName">2</div>
                            <div className="zoneName">1</div>
                        </div>
                    <div className="zoneColors">
                        <div className="zoneColor" style={{opacity: 1}}></div>
                        <div className="zoneColor" style={{opacity: 0.857143}}></div>
                        <div className="zoneColor" style={{opacity: 0.714286}}></div>
                        <div className="zoneColor" style={{opacity: 0.571429}}></div>
                        <div className="zoneColor" style={{opacity: 0.428571}}></div>
                        <div className="zoneColor" style={{opacity: 0.285714}}></div>
                        <div className="zoneColor" style={{opacity: 0.142857}}></div>
                    </div>

                    <div className="zoneValues">
                        <div className="zoneValue">{trainingZones.anaerobicCapacity+1}-2000</div>
                        <div className="zoneValue">{trainingZones.vo2Max}-{trainingZones.anaerobicCapacity}</div>
                        <div className="zoneValue">{trainingZones.lactateThreshold+1}-{trainingZones.vo2Max}</div>
                        <div className="zoneValue">{trainingZones.tempo+1}-{trainingZones.lactateThreshold}</div>
                        <div className="zoneValue">{trainingZones.endurance+1}-{trainingZones.tempo}</div>
                        <div className="zoneValue">{trainingZones.activeRecovery+1}-{trainingZones.endurance}</div>
                        <div className="zoneValue">0-{trainingZones.activeRecovery}</div>
                    </div>
                    </div>
                </span>

            </div>
        </div>
    ) : null;

    return (
        <div className="tv-app-today">
            <HeaderText>
                Today
            </HeaderText>
            
            {
                todayWorkoutId? workoutCard : emptyCard
            }

            <WorkoutModal 
                visible={modalVisible} 
                setVisible={setModalVisible}
                onClose={()=>setModalVisible(false)}
                date={modalDate}
                workoutId={todayWorkoutId}
            />
        </div>
    )
}

