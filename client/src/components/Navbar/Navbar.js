import "./index.less";

import { Link, useLocation } from "react-router-dom";
import UserInfo from "../UserInfo/UserInfo";
export default function NavBar() {
    const {pathname} = useLocation()


    return (
        <nav className="tv-app-nav">
            <h2 className="tv-app-nav-logo">Training View</h2>
            

            <span>
                <Link className={pathname==="/"? "tv-app-nav-selected" : null} to="/">Home</Link>
                <Link className={pathname==="/calendar"? "tv-app-nav-selected" : null} to="/calendar">Calendar</Link>
            </span>

            <UserInfo/>
        </nav>
    )
}