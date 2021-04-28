import "./index.less";
import WeeklyList from "../WeeklyList/WeeklyList";
import TodayInfo from "../TodayInfo/TodayInfo";
import TrainingLoad from "../TrainingLoad/TrainingLoad";

export default function MainBroad() {

    return (
        <div className="tv-app-mainboard">
            <WeeklyList />
            <TodayInfo />
            <TrainingLoad/>
        </div>
    )
}