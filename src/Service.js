const randomise = (value, factor) =>
    value + getRandomInRange(value * -factor, value * factor);

const getRandomInRange = (min, max) =>
    Math.random() * (max - min) + min;

export default {
    randomise,
    getRandomInRange,
};
