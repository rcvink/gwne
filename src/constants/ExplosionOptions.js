const PARTICIPANT = {
    animate: true,
    destroyOtherBody: true,
    updateTurn: false,
};
const PLANET = {
    animate: true,
    destroyOtherBody: false,
    updateTurn: true,
};
const WALL = {
    animate: false,
    destroyOtherBody: false,
    updateTurn: true,
};

export default {
    PARTICIPANT,
    PLANET,
    WALL,
};
