<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  import { CONSTANTS } from './constants';
  import { factory } from './factory.js';
  import { service } from './service.js';
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
    cpuScore,
    isPlayerTurn,
    isShotInProgress,
    walls,
    isShootingDisabled
    } from './stores.js';

  onMount(() => {
    setupMatter();
    runMatter();
    setWalls();
    startNewLevel();
    registerPermanentListeners();
  });

  const setupMatter = () => {
    Matter.use(MatterAttractors);
    engine.set(factory.createEngine());
    render.set(factory.createRender(document, $engine));
    runner.set(factory.createRunner());
    service.setGravityZero($engine);
    world.set($engine.world);
  }

  const runMatter = () => {
    Matter.Runner.run($runner, $engine);
    Matter.Render.run($render);
  }

  const setWalls = () =>
    walls.set(factory.createWalls(
      $render.options.width,
      $render.options.height
    ));

  const startNewLevel = () => {
    removeFromWorld(getAllBodies());
    planet.set(factory.createPlanet(
      $render.options.width, 
      $render.options.height));
    player.set(factory.createPlayer(
      $render.options.width,
      $render.options.height));
    cpu.set(factory.createCpu(
      $render.options.width,
      $render.options.height));
    populateWorld([ $planet, $player, $cpu, ...$walls ]);
    level.update(n => n + 1);
    fireCount.set(0);
    isPlayerTurn.set(true);
  }

  const registerPermanentListeners = () => {
    cpuFireOnCpuTurn();
    winOrLoseOnHit();
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.cpu,
      { animate: true, destroyOtherBody: true, updateTurn: false}); 
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.player,
      { animate: true, destroyOtherBody: true, updateTurn: false });
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.planet,
      { animate: true, destroyOtherBody: false, updateTurn: true });
    bulletsExplodeOnCollisionWithCategory(
      CONSTANTS.CATEGORIES.wall,
      { animate: false, destroyOtherBody: false, updateTurn: true }); 
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

  const cpuFireOnCpuTurn = () =>
    isPlayerTurn.subscribe(fireIfCpuTurn);

  const fireIfCpuTurn = (isNowPlayerTurn) => {
    if (!isNowPlayerTurn) {
        fire(
          $cpu, 
          $cpuRadians, 
          CONSTANTS.CPU_BULLET_VELOCITY, 
          CONSTANTS.COLLISION_FILTERS.bullets.cpu);
    }
  }

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

  const bulletsExplodeOnCollisionWithCategory = (category, options) =>
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

      isShotInProgress.set(false);
      if (options.animate) {
        populateWorld(factory.createParticles(bullet));
      }
      removeFromWorld(bullet);
      if (options.destroyOtherBody) {
        removeFromWorld(other);
      }
      if (options.updateTurn) {
        isPlayerTurn.update(n => !n);
      }
    });

  const trailOnUpdate = (categoriesToTrail, trailSize) =>
    Matter.Events.on($engine, "afterUpdate", (event) => 
      getAllBodies()
        .filter(body => categoriesToTrail.includes(body.collisionFilter.category))
        .forEach(bodyToTrail => populateWorld(factory.createTrail(bodyToTrail, trailSize))));

  const removeSleepingOnUpdate = (categoriesToRemove) => 
    Matter.Events.on($engine, "afterUpdate", (event) =>
      getAllBodies()
        .filter(body => body.isSleeping)
        .filter(sleepingBody => categoriesToRemove.includes(sleepingBody.collisionFilter.category))
        .forEach(removeFromWorld));

  const populateWorld = (objectsToAdd) =>
    Matter.World.add($world, objectsToAdd);

  const fire = (fromBody, rads, velocity, collisionFilter) => {
    isShotInProgress.set(true);
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

  const getAllBodies = () =>
    Matter.Composite.allBodies($world);

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
  <input type="number" bind:value={$bulletSettings.angleDegrees} min="-90" max="90"/>
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
<div>
  <button on:click={onClick} disabled={$isShootingDisabled}>
  {#if $isShotInProgress && !$isPlayerTurn}
    cpu shot in progress...
  {:else if $isShotInProgress && $isPlayerTurn}
    player shot in progress...
  {:else}
    fire!
  {/if}
  </button>
</div>
<div>
  is player turn: {$isPlayerTurn}
</div>
<div>
  is shot in progress: {$isShotInProgress}
</div>

<div id="{CONSTANTS.CANVAS_ID}"/>