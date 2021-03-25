import {useSelector} from "react-redux"

export default function UserInfo() {
    const basicInfo = useSelector(state => state.user.basicInfo)
    return (
        <span className="tv-app-nav-userinfo">
            <span>{basicInfo.realName}</span>
            
        </span>
    )
}