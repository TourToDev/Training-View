import React,{Children,useState} from 'react';
import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css';
import "./index.less";
import { Calendar as BigCalendar, momentLocalizer  } from 'react-big-calendar' ;
import moment from 'moment'
import { isSameDay, secondsToHms } from '../../lib/timeUtils';
import WorkoutModal from '../WorkoutModal/WorkoutModal';
const localizer = momentLocalizer(moment) 

const myEvents = [
    // {
    //     id: '607eb599048a070fd8c3c851',
    //     title: 'Point in Time Event',
    //     start: new Date(1618829903985),
    //     end: new Date(1618829903985),
    //     workoutData:{
    //         workoutId: '607eb599048a070fd8c3c851',
    //         status: 'completed',
    //         workoutTimestamp: 1618829903985,
    //         basic: {
    //           FTP: 300,
    //           duration: 7200,
    //           elevation_gain: 200,
    //           distance: 80,
    //           avg_speed: 0
    //         },
    //         power: {
    //           avg_power: null,
    //           max_power: null,
    //           NP: 0,
    //           TSS: 100,
    //           IF: 1,
    //           VI: null
    //         }
    //     }
    // },
]

const ColoredDateCellWrapper = (setVisible, setDate, setWorkoutId) => ({event,children, value}) =>{
    const isEvent =  myEvents.some( event => isSameDay(value, event.start) );
    const plus = (
        <div className="tv-datewrapper-plus-container">
            <div className="tv-datewrapper-plus" onClick={() => {
                setVisible(true);
                setDate(value);
                setWorkoutId(null);
            }}>
                +
            </div>
        </div>

    )
    return (
            // React.cloneElement(Children.only(children), 
            // {
            //     style: {
            //         ...children.style,
            //         backgroundColor: value < moment().toDate() ? 'lightgreen' : 'lightblue',
            //     },
            //     onClick:()=>{
            //         console.log(value)
            //         console.log(children)
            //     }
            // },)
            <div className="tv-datewrapper" onClick={()=>{                
            }}>
                {plus}
                {children}
            </div>
    )
  }

const CustomEventComponent = (setWorkoutId,setVisible,setDate) => (event) => { 
    const workout = event.event.workoutData;
    return ( 
        <span onClick={()=>{
            setVisible(true);
            setWorkoutId(event.event.id);
            setDate(workout.workoutTimestamp);
        }}> 
            <p>{secondsToHms(workout.basic.duration)}</p>
            <p>{workout.basic.distance} KM</p>
            <p>{workout.power.TSS} TSS</p>
        </span> 
    ) 
}

export default function Calendar() {
    const [workoutId, setWorkoutId] = useState(null);
    const [visible, setVisible] = useState(false)
    const [date, setDate] = useState(null);
    return (
        <div style={{height:"100%",padding:"1em"}}>
            <div style={{height:"100%"}}>
                <BigCalendar
                    localizer={localizer}
                    events={myEvents}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month']}
                    components={
                        { 
                            event:CustomEventComponent(setWorkoutId, setVisible, setDate),
                            dateCellWrapper: ColoredDateCellWrapper(setVisible, setWorkoutId, setDate),
                        }
                    }
                />
            </div>
            <WorkoutModal 
                workoutId={workoutId}
                visible={visible}
                onClose={()=>setVisible(false)}
                setVisible={setVisible}
                setWorkoutId={setWorkoutId}
                date={date}

            />
        </div>
    )
}
