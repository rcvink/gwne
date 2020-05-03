import Matter from "matter-js";

const bulletsExplodeOnCollisionWithCategory = (
    engine,
    category,
    isShotInProgressStore,
    isPlayerTurnStore,
    animateCb,
    removeCb,
    options) =>
    Matter.Events.on(engine, "collisionStart", event => {
        let bullet, other;
        let pairs = event.pairs[0];

        if (pairs.bodyA.collisionFilter.category === category) {
            bullet = pairs.bodyB;
            other = pairs.bodyA;
        } else if (pairs.bodyB.collisionFilter.category === category) {
            bullet = pairs.bodyA;
            other = pairs.bodyB;
        } else {
            return null;
        }

        isShotInProgressStore.set(false);
        if (options.animate) {
            animateCb(bullet);
        }
        removeCb(bullet);
        if (options.destroyOtherBody) {
            removeCb(other);
        }
        if (options.updateTurn) {
            isPlayerTurnStore.update(n => !n);
        }
    });

const removeSleepingOnUpdate = (engine, getAllBodiesCb, categoriesToRemove, removeCb) =>
    Matter.Events.on(engine, "afterUpdate", event =>
        getAllBodiesCb()
            .filter(body => body.isSleeping)
            .filter(sleepingBody =>
                categoriesToRemove.includes(sleepingBody.collisionFilter.category)
            )
            .forEach(removeCb)
    );

const trackMousePosition = (engine, mouseStore, mouseValue) =>
    Matter.Events.on(engine, "afterUpdate", () => mouseStore.set(mouseValue));

const trailOnUpdate = (engine, getAllBodiesCb, categoriesToTrail, populateWorldCb) =>
    Matter.Events.on(engine, "afterUpdate", event =>
        getAllBodiesCb()
            .filter(body =>
                categoriesToTrail.includes(body.collisionFilter.category)
            )
            .forEach(bodyToTrail =>
                populateWorldCb(bodyToTrail)
            )
    );

const winOrLoseOnHit = (engine, cpuId, playerId, playerScoreStore, cpuScoreStore, cb) =>
    Matter.Events.on(engine, "collisionStart", event => {
        let pairs = event.pairs[0];
        if (pairs.bodyA.id === cpuId || pairs.bodyB.id === cpuId) {
            playerScoreStore.update(n => n + 1);
        } else if (pairs.bodyA.id === playerId || pairs.bodyB.id === playerId) {
            cpuScoreStore.update(n => n + 1);
        } else {
            return;
        }
        cb();
    });

export default {
    bulletsExplodeOnCollisionWithCategory,
    removeSleepingOnUpdate,
    trackMousePosition,
    trailOnUpdate,
    winOrLoseOnHit,
};
