import Matter from "matter-js";
import { CONSTANTS } from './constants'

const getWallsDimensions = (renderWidth, renderHeight) => 
  ({
    top: {
      x: renderWidth / 2,
      y: renderHeight * -1,
      w: renderWidth * 3,
      h: CONSTANTS.WALL_THICKNESS
    },
    bottom: {
      x: renderWidth / 2,
      y: renderHeight * 2,
      w: renderWidth * 3,
      h: CONSTANTS.WALL_THICKNESS
    },
    left: {
      x: renderWidth * -1,
      y: renderHeight / 2,
      w: CONSTANTS.WALL_THICKNESS,
      h: renderHeight * 3
    },
    right: {
      x: renderWidth * 2,
      y: renderHeight / 2,
      w: CONSTANTS.WALL_THICKNESS,
      h: renderHeight * 3
    }
  });

const getCpuDimensions = (renderWidth, renderHeight) =>
  ({
    x: getRandomInRange(
      (4 * renderWidth / 5) + (CONSTANTS.CPU_LENGTH / 2),
      renderWidth - (CONSTANTS.CPU_LENGTH / 2) - 10),
    y: getRandomInRange(
      (CONSTANTS.CPU_LENGTH / 2) + 10,
      renderHeight - (CONSTANTS.CPU_LENGTH / 2) - 10)
  });

const getPlanetDimensions = (renderWidth, renderHeight) => {
  let r = getRandomInRange(
    CONSTANTS.PLANET_RADIUS_MIN, 
    Math.min(renderWidth / 8, renderHeight / 8));
  return {
    x: getRandomInRange(
      (renderWidth / 5) + r,
      (3 * renderWidth / 5) - r),
    y: getRandomInRange(
      r + 10,
      renderHeight - r),
    r
  };
}

const getPlayerDimensions = (renderWidth, renderHeight) => 
  ({
    x: getRandomInRange(
      (CONSTANTS.PLAYER_LENGTH / 2) + 10,
      (renderWidth / 5) - (CONSTANTS.PLAYER_LENGTH / 2)),
    y: getRandomInRange(
      (CONSTANTS.PLAYER_LENGTH / 2) + 10,
      (renderHeight) - (CONSTANTS.PLAYER_LENGTH / 2))
  });

const gravityOnColliders = (bodyA, bodyB) => {
  if (!Matter.Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) {
    return null;
  }
  let bToA = Matter.Vector.sub(bodyB.position, bodyA.position);
  let distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001; 
  let normal = Matter.Vector.normalise(bToA)
  let magnitude = -CONSTANTS.GRAVITATIONAL_CONSTANT * 
    (bodyA.mass * bodyB.mass / distanceSq);
  return Matter.Vector.mult(normal, magnitude);
}

const setGravityZero = (engine) =>
  engine.world.gravity.scale = 0;

const randomise = (value, factor) =>
  value + getRandomInRange(value * -factor, value * factor);

const getRandomInRange = (min, max) => 
  Math.random() * (max - min) + min;

export const service = {
  getWallsDimensions,
  getCpuDimensions,
  getPlanetDimensions,
  getPlayerDimensions,
  gravityOnColliders,
  setGravityZero,
  randomise,
  getRandomInRange,
};
