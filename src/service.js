import Matter from "matter-js";
import { CONSTANTS } from './constants'

const gravityOnColliders = (bodyA, bodyB) => 
  Matter.Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter) ? 
  ({
    x: (bodyA.position.x - bodyB.position.x) * CONSTANTS.GRAVITATIONAL_CONSTANT,
    y: (bodyA.position.y - bodyB.position.y) * CONSTANTS.GRAVITATIONAL_CONSTANT
  }) :
  null

export const service = {
    gravityOnColliders
};