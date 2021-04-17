import { useState, useRef } from "react";
import {useSelector, useDispatch} from "react-redux";
import { Menu, Dropdown, Spin } from 'antd';
import "./index.less";
import Modal from "../Modal/Modal";
import HeaderText from "../HeaderText";
import { Field, Form, Formik } from "formik";
import Button from "../Button/Button";
import { updateUser } from "../../features/user/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import * as Recharts from 'recharts';
const {XAxis,YAxis,CartesianGrid,BarChart,Tooltip,Bar, Legend} = Recharts;
  


export default function UserInfo() {
    const user = useSelector(state => state.user)
    const basicInfo = useSelector(state => state.user.basicInfo);
    const powerInfo = useSelector(state => state.user.powerInfo);
    const powerProfile = powerInfo.powerProfile;
    const trainingZones = powerInfo.trainingZones;
    const [modalActive,setModalActive] = useState(false);
    const [selected, setSelected] = useState("personal")

    const dispatch = useDispatch();

    const menu = (
        <Menu className="tv-app-dropdown">
          <Menu.Item >
            <span onClick={()=>setModalActive(true)}>Setting</span>
          </Menu.Item>
          <Menu.Item disabled>
            Log out
          </Menu.Item>
        </Menu>
      );

    const title = (
      <h2 className="tv-usermodal-title">
        Account Setting
      </h2>
    )
    const formRef = useRef()

    const handleSubmit = () => {
      if (formRef.current) {
        formRef.current.handleSubmit()
      }
    }
    const personalContent = (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }}/>} spinning={user.updating} >
        <div className="tv-user-personal">
          <HeaderText>
            Personal
          </HeaderText>
          <h3>Personal Information</h3>
          <Formik
            innerRef={formRef}
            enableReinitialize={true}
            initialValues={{
              realName:basicInfo.realName,
              username:basicInfo.username,
              email:basicInfo.email,
              gender:basicInfo.gender,
              age:basicInfo.age,
              weight:basicInfo.weight
            }}
            onSubmit={
              values => {
                dispatch(updateUser(values));
              }
            }
          >
            <Form>
              <div>
                <label htmlFor="realName">First And Last Name: </label>
                <Field name="realName" type="text" />
              </div>

              <div>
                <label htmlFor="username">Username: </label>
                <Field name="username" type="text" disabled/>
              </div>

              <div>
                <label htmlFor="email">Email Address: </label>
                <Field name="email" type="email" />
              </div>
              
              <div>
                <label htmlFor="gender">
                  Gender:
                </label>
                <Field as="select" name="gender" >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
              </div>

              <div>
                <label htmlFor="age">Age: </label>
                <Field name="age" type="number" />
              </div>

              <div>
                <label htmlFor="weight">Weight: </label>
                <Field name="weight" type="number" />
                <span>kg</span>
              </div>
              
            </Form>
          </Formik>
        </div>
      </Spin>
    )

    const data = [
      {
        "name": "5s Max",
        "power": powerProfile.max5s,
      },
      {
        "name": "30s Max",
        "power": powerProfile.max30s,
      },
      {
        "name": "1 min Max",
        "power": powerProfile.max1mins,

      },
      {
        "name": "5 mins Max",
        "power": powerProfile.max5mins,

      },
      {
        "name": "20 mins Max",
        "power": powerProfile.max20mins,

      },
      {
        "name": "60 mins Max",
        "power": powerProfile.max60mins,

      },
    ]

    const powerContent = (
      <div className="tv-user-power">
        <HeaderText>
          Power
        </HeaderText>
        <h3>Power Information</h3>
        <Formik
          innerRef={formRef}
          enableReinitialize={true}
          initialValues={{
            FTP:powerInfo.FTP,
          }}

        >
          <fieldset>
            <legend>Threshold Power</legend>
            <label htmlFor="FTP">Threshold</label>
            <Field name="FTP" type="number"/>
            <span>W</span>
          </fieldset>
        </Formik>

        {/* <XYPlot height={300} width={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />

          <BarSer data={data} />
        </XYPlot> */}
        <fieldset>
          <legend>Training Zones</legend>
          <div className="zones">
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
        </fieldset>

        <fieldset>
          <legend>Power Profile</legend>
          <BarChart width={600} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="power" fill="#8884d8" />
          </BarChart>
        </fieldset>
      </div>

    )

    const footer = (
      <div className="tv-app-userinfo-footer">
        <Button>Cancel</Button>
        <Button onClick={()=>handleSubmit()}>Save</Button>
        <Button>Save&Close</Button>
      </div>
    )
   
    let renderContent;
    if (selected==="personal") {
      renderContent = personalContent;
    } else if (selected==="power") {
      renderContent = powerContent;
    }

    return (
        <>
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <span className="tv-app-nav-userinfo">
                    <span>{basicInfo.realName}</span>
                </span>
            </Dropdown>

            <Modal 
              title={title} 
              visible={modalActive} 
              onClose={() => setModalActive(false)} 
              footer={footer}
              bodyStyle={{
                maxWidth:"80vw",
                minWidth:"800px",
                height:"630px",
              }}
            >
            <div className="tv-app-userinfo">
              <ul className="tv-app-userinfo-sidebar">
                <li className={selected==="personal"?"selected" : null} onClick={()=>setSelected("personal")}>Personal</li>
                <li className={selected==="power"?"selected" : null} onClick={()=>setSelected("power")}>Power</li>
              </ul>
              <div className="tv-app-userinfo-content">
                {renderContent}
              </div>
            </div>
            </Modal>
        </>
    )
}