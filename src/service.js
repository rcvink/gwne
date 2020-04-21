import Matter from "matter-js";

const GRAVITATIONAL_CONSTANT = 0.0001;

const gravityOnColliders = (bodyA, bodyB) => 
  Matter.Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter) ? 
  ({
    x: (bodyA.position.x - bodyB.position.x) * GRAVITATIONAL_CONSTANT,
    y: (bodyA.position.y - bodyB.position.y) * GRAVITATIONAL_CONSTANT
  }) :
  null

export const service = {
    gravityOnColliders
};