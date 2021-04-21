export function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins") : "";
    // return hDisplay + mDisplay; 
    var hDisplay = h > 0 ? h : "0"
    var mDisplay = m > 0 ? m : "00"
    var sDisplay = s > 0 ? s : "00"
    return `${hDisplay}:${mDisplay}:${sDisplay}`
}

export function hmsToSecond(hms="") {
    const hmsArr = hms.split(":");
    const [hour, mins, second] = hmsArr;
    return parseInt(hour) * 3600 + parseInt(mins) * 60 + parseInt(second);
}

export function isSameDay(dayA=new Date(), dayB=new Date()){
    return dayA.getFullYear()===dayB.getFullYear()
         &&dayA.getMonth()===dayB.getMonth()
         &&dayA.getDate()===dayB.getDate();
}