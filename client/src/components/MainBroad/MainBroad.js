import "./index.less";
import WeeklyList from "../WeeklyList/WeeklyList";
import TodayInfo from "../TodayInfo/TodayInfo";

export default function MainBroad() {

    return (
        <div className="tv-app-mainboard">
            <WeeklyList />
            <TodayInfo />
        </div>
    )
}