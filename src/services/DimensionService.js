import Constants from '../Constants';
import Dimensions from '../constants/Dimensions';
import RandomService from './RandomService'

const getCpuDimensions = (renderWidth, renderHeight) =>
    ({
        x: RandomService.getRandomInRange(
            (4 * renderWidth / 5) + (Dimensions.CPU_LENGTH / 2),
            renderWidth - (Dimensions.CPU_LENGTH / 2) - 10),
        y: RandomService.getRandomInRange(
            (Dimensions.CPU_LENGTH / 2) + 10,
            renderHeight - (Dimensions.CPU_LENGTH / 2) - 10)
    });

const getPlanetDimensions = (renderWidth, renderHeight) => {
    let r = RandomService.getRandomInRange(
        Dimensions.PLANET_RADIUS_MIN,
        Math.min(renderWidth / 8, renderHeight / 8));
    return {
        x: RandomService.getRandomInRange(
            (renderWidth / 5) + r,
            (3 * renderWidth / 5) - r),
        y: RandomService.getRandomInRange(
            r + 10,
            renderHeight - r),
        r
    };
}

const getPlayerDimensions = (renderWidth, renderHeight) =>
    ({
        x: RandomService.getRandomInRange(
            (Dimensions.PLAYER_LENGTH / 2) + 10,
            (renderWidth / 5) - (Dimensions.PLAYER_LENGTH / 2)),
        y: RandomService.getRandomInRange(
            (Dimensions.PLAYER_LENGTH / 2) + 10,
            (renderHeight) - (Dimensions.PLAYER_LENGTH / 2))
    });

const getWallsDimensions = (renderWidth, renderHeight) =>
    ({
        top: {
            x: renderWidth / 2,
            y: renderHeight * -1,
            w: renderWidth * 3,
            h: Dimensions.WALL_THICKNESS
        },
        bottom: {
            x: renderWidth / 2,
            y: renderHeight * 2,
            w: renderWidth * 3,
            h: Dimensions.WALL_THICKNESS
        },
        left: {
            x: renderWidth * -1,
            y: renderHeight / 2,
            w: Dimensions.WALL_THICKNESS,
            h: renderHeight * 3
        },
        right: {
            x: renderWidth * 2,
            y: renderHeight / 2,
            w: Dimensions.WALL_THICKNESS,
            h: renderHeight * 3
        }
    });

export default {
    getCpuDimensions,
    getPlanetDimensions,
    getPlayerDimensions,
    getWallsDimensions,
};
