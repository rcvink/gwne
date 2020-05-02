import Matter from 'matter-js';
import Constants from '../Constants'

const gravityOnColliders = (bodyA, bodyB) => {
    if (!Matter.Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) {
        return null;
    }
    let bToA = Matter.Vector.sub(bodyB.position, bodyA.position);
    let distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001;
    let normal = Matter.Vector.normalise(bToA)
    let magnitude = -Constants.GRAVITATIONAL_CONSTANT *
        (bodyA.mass * bodyB.mass / distanceSq);
    return Matter.Vector.mult(normal, magnitude);
}

const setGravityZero = (engine) =>
    engine.world.gravity.scale = 0;

export default {
    gravityOnColliders,
    setGravityZero,
};
