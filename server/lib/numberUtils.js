function trimTo2Digit(num=0) {
    return parseFloat(num.toFixed(2));
}

module.exports = {
    trimTo2Digit,
}