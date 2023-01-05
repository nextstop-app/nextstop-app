
const icons = {
    "N": 51617 
};
const routeIdToIcon = (routeId) => {
    return icons[routeId] || 51617;
}
const generateFrame = (text, routeId, index = 0) => {

    return {
        "text": text,
        "icon": routeIdToIcon(routeId),
        "index": index
    }
}
const generateFrames = (trains, maxFrames = 3) => {
    const result = { frames: [] };
    const max =  trains.length > maxFrames ? maxFrames : trains.length;
    let time, routeId;
    for(let i=0; i < max; i++){
        ({time, routeId} = trains[i]);
        result.frames.push(generateFrame(time, routeId, i))
    }

    return result;
}

module.exports = {
    generateFrames
}