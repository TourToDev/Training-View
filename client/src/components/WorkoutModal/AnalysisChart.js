import React, {useState,useEffect} from 'react';
import * as Recharts from "recharts";

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


export default function AnalysisChart({workoutId}) {

    const [chartData, setChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    useEffect(() => {
        if (workoutId) {
            fetch("http://localhost:3000/workoutsCollection/get/detail/"+workoutId,{
                mode:"cors",
                credentials:"include",
            })
            .then(res => {
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
    return (        
            <div style={{height:"500px",overflow:"auto"}}>
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
    )
}
