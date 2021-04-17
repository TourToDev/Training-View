import { Formik,Form,Field} from 'formik';
import React, {useRef} from 'react'
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

import "./index.less";
export default function WorkoutModal({visible, onClose ,workoutId, date}) {
    const header = (
        <>
            <span>{new Date(date).toString()}</span>
            <div>
                <b>--:--:--</b>
                <b>-- km</b>
                <b>-- TSS</b>
            </div>
        </>
    );

    const formRef = useRef();

    const handleSubmit = () => {
      if (formRef.current) {
        formRef.current.handleSubmit()
      }
    }

    const footer = (
        <div className="tv-app-userinfo-footer">
          <Button>Cancel</Button>
          <Button onClick={()=>handleSubmit()}>Save</Button>
          <Button>Save&Close</Button>
        </div>
      )



    return (
        <Modal className="tv-workoutmodal" 
                visible={visible} 
                onClose={onClose} 
                header={header} 
                footer={footer}
        >
            <div>
                <div className="tv-workoutmodal-fieldtypes">
                    <span>Planned</span>
                    <span>Completed</span>
                </div>

                <Formik
                    innerRef={formRef}
                    enableReinitialize={true}
                    initialValues={{
                        plannedDuration:0,
                        plannedDistance:0,
                        plannedAvgSpeed:0,
                        plannedElevationGain:0,
                        plannedTSS:0,
                        plannedIF:0,
                        plannedNP:0,
                        duration:0,
                        distance:0,
                        avg_speed:0,
                        elevation_gain:0,
                        TSS:0,
                        IF:0,
                        NP:0,
                        min_power:0,
                        avg_power:0,
                        max_power:0,
                    }}
                    onSubmit={values=>{
                        console.log(values)
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
                            <Field type="number" name="plannedDuration"/>
                            <Field type="number" name="plannedDistance"/>
                            <Field type="number" name="plannedAvgSpeed"/>
                            <Field type="number" name="plannedElevationGain"/>
                            <Field type="number" name="plannedTSS"/>
                            <Field type="number" name="plannedIF"/>
                            <Field type="number" name="plannedNP"/>
                        </div>
                        <div className="tv-workoutmodal-forminputs">
                            <Field type="number" name="duration"/>
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
            </div>
        </Modal>
    )
}
