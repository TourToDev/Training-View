const setTrainingZone = (trainingZone,FTP) => {
    const zoneToPower = {
        activeRecovery:parseInt(FTP * 0.55),
        endurance: parseInt(FTP * 0.75),
        tempo: parseInt(FTP * 0.9),
        lactateThreshold:parseInt(FTP * 1.05),
        vo2Max:parseInt(FTP * 1.2),
        anaerobicCapacity: parseInt(FTP * 1.5),
        neuromuscular: Infinity,
    }
    for (const zoneName in zoneToPower) {
        if (Object.hasOwnProperty.call(zoneToPower, zoneName)) {
            const powerNum = zoneToPower[zoneName];
            trainingZone.push({
                zoneName,
                zoneMaxPower:powerNum,
            });
        }
    }
    return trainingZone;
}

console.log(setTrainingZone([],100))