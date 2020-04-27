import Matter from "matter-js";
import { CONSTANTS } from './constants'

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
  let r = getRandomInRange(60, 
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

const gravityOnColliders = (bodyA, bodyB) => 
  Matter.Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter) ? 
  ({
    x: (bodyA.position.x - bodyB.position.x) * CONSTANTS.GRAVITATIONAL_CONSTANT,
    y: (bodyA.position.y - bodyB.position.y) * CONSTANTS.GRAVITATIONAL_CONSTANT
  }) :
  null;

const getRandomInRange = (min, max) => 
  Math.random() * (max - min) + min;

export const service = {
  getCpuDimensions,
  getPlanetDimensions,
  getPlayerDimensions,
  gravityOnColliders
};
