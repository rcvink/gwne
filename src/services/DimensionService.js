import Constants from '../Constants';
import Service from '../Service';

const getCpuDimensions = (renderWidth, renderHeight) =>
    ({
        x: Service.getRandomInRange(
            (4 * renderWidth / 5) + (Constants.CPU_LENGTH / 2),
            renderWidth - (Constants.CPU_LENGTH / 2) - 10),
        y: Service.getRandomInRange(
            (Constants.CPU_LENGTH / 2) + 10,
            renderHeight - (Constants.CPU_LENGTH / 2) - 10)
    });

const getPlanetDimensions = (renderWidth, renderHeight) => {
    let r = Service.getRandomInRange(
        Constants.PLANET_RADIUS_MIN,
        Math.min(renderWidth / 8, renderHeight / 8));
    return {
        x: Service.getRandomInRange(
            (renderWidth / 5) + r,
            (3 * renderWidth / 5) - r),
        y: Service.getRandomInRange(
            r + 10,
            renderHeight - r),
        r
    };
}

const getPlayerDimensions = (renderWidth, renderHeight) =>
    ({
        x: Service.getRandomInRange(
            (Constants.PLAYER_LENGTH / 2) + 10,
            (renderWidth / 5) - (Constants.PLAYER_LENGTH / 2)),
        y: Service.getRandomInRange(
            (Constants.PLAYER_LENGTH / 2) + 10,
            (renderHeight) - (Constants.PLAYER_LENGTH / 2))
    });

const getWallsDimensions = (renderWidth, renderHeight) =>
    ({
        top: {
            x: renderWidth / 2,
            y: renderHeight * -1,
            w: renderWidth * 3,
            h: Constants.WALL_THICKNESS
        },
        bottom: {
            x: renderWidth / 2,
            y: renderHeight * 2,
            w: renderWidth * 3,
            h: Constants.WALL_THICKNESS
        },
        left: {
            x: renderWidth * -1,
            y: renderHeight / 2,
            w: Constants.WALL_THICKNESS,
            h: renderHeight * 3
        },
        right: {
            x: renderWidth * 2,
            y: renderHeight / 2,
            w: Constants.WALL_THICKNESS,
            h: renderHeight * 3
        }
    });

export default {
    getCpuDimensions,
    getPlanetDimensions,
    getPlayerDimensions,
    getWallsDimensions,
}
