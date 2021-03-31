
// let now = new Date();
// now.setDate(now.getDate()-now.getDay()+1);
// now.setHours(0,0,0,0);
// console.log(new Date(now.toISOString()));
// console.log(new Date(now.toUTCString()))
// console.log(now.getHours())

// let weekEnd = now.getTime() + (7 * 24 * 60 * 60 * 1000)
// console.log(new Date(weekEnd))

function weekTimeRange() {
    const today = new Date();
    
    let dayFromMonday = 0;
    if (today.getDay() === 0) {
        dayFromMonday = 6;
    } else {
        dayFromMonday = today.getDay() - 1;
    }

    today.setDate(today.getDate() - dayFromMonday);
    today.setHours(0,0,0,0);

    const weekStart = today.getTime();
    const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000);

    return [weekStart, weekEnd];
}

module.exports = {
    weekTimeRange,
};