<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  import { CONSTANTS } from './constants';
  import { factory } from './factory.js';
  import { 
    engine,
    runner,
    render,
    world, 
    player, 
    bulletSettings, 
    playerRadians,
    fireCount,
    cpu,
    cpuRadians,
    level,
    planet,
    playerScore,
    cpuScore
    } from './stores.js';

  onMount(() => {
    setupMatter();
    startNewLevel();
    registerPermanentListeners();
  });

  const setupMatter = () => {
    Matter.use(MatterAttractors);
    render.set(factory.createRender(document, $engine));
    Matter.Runner.run($runner, $engine);
    Matter.Render.run($render);
    $engine.world.gravity.scale = 0;
    world.set($engine.world);
  }

  const startNewLevel = () => {
    removeFromWorld(
      Matter.Composite.allBodies($world));
    planet.set(factory.createPlanet(
      $render.options.width, 
      $render.options.height));
    player.set(factory.createPlayer(
      $render.options.width,
      $render.options.height));
    cpu.set(factory.createCpu(
      $render.options.width,
      $render.options.height)); 
    populateWorld([ $planet, $player, $cpu ]);
    level.update(n => n + 1);
    fireCount.set(0);
  }

  const registerPermanentListeners = () => {
    cpuFireOnPlayerFire();
    winOrLoseOnHit();
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.cpu, 
      true);
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.player, 
      true);
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.planet, 
      false);
    trailOnUpdate([ 
      CONSTANTS.CATEGORIES.bullet.cpu, 
      CONSTANTS.CATEGORIES.bullet.player ],
      CONSTANTS.TRAIL_BULLET_SIZE);
    trailOnUpdate(
      [ CONSTANTS.CATEGORIES.particle ],
      CONSTANTS.TRAIL_PARTICLE_SIZE);
    removeSleepingOnUpdate(
      [ CONSTANTS.CATEGORIES.particle, CONSTANTS.CATEGORIES.trail ]);
  }

  const cpuFireOnPlayerFire = () =>
    fireCount.subscribe((newValue) => {
      if (newValue > 0) {
        fire(
          $cpu, 
          $cpuRadians, 
          CONSTANTS.CPU_BULLET_VELOCITY, 
          CONSTANTS.COLLISION_FILTERS.bullets.cpu);
      }
    });

  const winOrLoseOnHit = () => 
    Matter.Events.on($engine, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id === $cpu.id || pairs.bodyB.id === $cpu.id) {
        playerScore.update(n => n + 1);
        startNewLevel();
      } else if (pairs.bodyA.id === $player.id || pairs.bodyB.id === $cpu.id) {
        cpuScore.update(n => n + 1);
        startNewLevel();
      } 
    });

  const bulletsExplodeOnCollisionWithCategory = (
    category, 
    shouldDestroyNonBullet) =>
    Matter.Events.on($engine, "collisionStart", (event) => {
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

      let particles = factory.createParticles(bullet);
      populateWorld(particles);
      removeFromWorld(bullet);

      if (shouldDestroyNonBullet) {
        removeFromWorld(other);
      }
    });

  const trailOnUpdate = (categoriesToTrail, trailSize) =>
    Matter.Events.on($engine, "afterUpdate", (event) => 
      Matter.Composite
        .allBodies($world)
        .filter(body => categoriesToTrail.includes(body.collisionFilter.category))
        .forEach(bodyToTrail => populateWorld(factory.createTrail(bodyToTrail, trailSize))));

  const removeSleepingOnUpdate = (categoriesToRemove) => 
    Matter.Events.on($engine, "afterUpdate", (event) =>
      Matter.Composite
        .allBodies($world)
        .filter(body => body.isSleeping)
        .filter(sleepingBody => categoriesToRemove.includes(sleepingBody.collisionFilter.category))
        .forEach(bodyToRemove => removeFromWorld(bodyToRemove)));

  const populateWorld = (objectsToAdd) =>
    Matter.World.add($world, objectsToAdd);

  const fire = (fromBody, rads, velocity, collisionFilter) => {
    let bullet = factory.createBullet(
      fromBody, 
      collisionFilter);

    populateWorld(bullet);
    Matter.Body.applyForce(
      bullet,
      bullet.position,
      factory.createBulletForce(rads, velocity));
  }

  const removeFromWorld = (objectsToRemove) =>
    Matter.World.remove($world, objectsToRemove);

  const onClick = () => {
    fire(
      $player, 
      $playerRadians, 
      $bulletSettings.velocity, 
      CONSTANTS.COLLISION_FILTERS.bullets.player);
    fireCount.update(n => n + 1);
  }

</script>

<div>
  angle:
  <input type="number" bind:value={$bulletSettings.angleDegrees} min="0" max="359"/>
</div>
<div>
  velocity:
  <input type="number" bind:value={$bulletSettings.velocity} min="1" max="10"/>
</div>
<div>
  level: {$level}
</div>
<div>
  shots fired: {$fireCount}
</div>
<div>
  player score: {$playerScore}
</div>
<div>
  cpu score: {$cpuScore}
</div>

<div id="{CONSTANTS.CANVAS_ID}" on:click={onClick} />