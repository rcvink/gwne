<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";
  import Constants from './Constants';
  import Factory from './Factory';
  import Render from "./Render";
  import Service from './Service';
  import {
    engine,
    runner,
    render,
    world,
    player,
    fireCount,
    cpu,
    level,
    planet,
    playerScore,
    cpuScore,
    isPlayerTurn,
    isShotInProgress,
    walls,
    mouseConstraint,
    mousedownPosition,
    mouse
  } from './stores/writable';
  import {
    currentPlayerDegrees,
    currentPlayerVelocity,
    playerRadians,
    lastPlayerDegrees,
    playerVelocity,
    lastPlayerVelocity,
    cpuRadians,
    isShootingEnabled,
  } from './stores/derived';

  onMount(() => {
    setupMatter();
    runMatter();
    setupMouse();
    setWalls();
    startNewLevel();
    registerPermanentListeners();
  });

  const setupMatter = () => {
    Matter.use(MatterAttractors);
    engine.set(Factory.createEngine());
    render.set(Factory.createRender(document, $engine));
    runner.set(Factory.createRunner());
    Service.setGravityZero($engine);
    world.set($engine.world);
  }

  const runMatter = () => {
    Matter.Runner.run($runner, $engine);
    Render.run($render);
  }

  const setupMouse = () => {
    mouse.set(Factory.createMouse($render.canvas));
    mouseConstraint.set(Factory.createMouseConstraint($engine, $mouse));
    $render.mouse = $mouse;
  }

  const setWalls = () =>
    walls.set(Factory.createWalls(
      $render.options.width,
      $render.options.height
    ));

  const startNewLevel = () => {
    removeFromWorld(getAllBodies());
    planet.set(Factory.createPlanet(
      $render.options.width, 
      $render.options.height));
    player.set(Factory.createPlayer(
      $render.options.width,
      $render.options.height));
    $render.playerPosition = $player.position;
    cpu.set(Factory.createCpu(
      $render.options.width,
      $render.options.height));
    populateWorld([ 
      $planet, 
      $player, 
      $cpu, 
      ...$walls, 
      $mouseConstraint]);
    level.update(n => n + 1);
    fireCount.set(0);
    isPlayerTurn.set(true);
  }

  const registerPermanentListeners = () => {
    trackMousePosition();
    trackCurrentPlayerVelocity();
    trackCurrentPlayerDegrees();
    playerFireOnClick();
    cpuFireOnCpuTurn();
    winOrLoseOnHit();
    bulletsExplodeOnCollisionWithCategory(
      Constants.CATEGORIES.cpu,
      { animate: true, destroyOtherBody: true, updateTurn: false}); 
    bulletsExplodeOnCollisionWithCategory(
      Constants.CATEGORIES.player,
      { animate: true, destroyOtherBody: true, updateTurn: false });
    bulletsExplodeOnCollisionWithCategory(
      Constants.CATEGORIES.planet,
      { animate: true, destroyOtherBody: false, updateTurn: true });
    bulletsExplodeOnCollisionWithCategory(
      Constants.CATEGORIES.wall,
      { animate: false, destroyOtherBody: false, updateTurn: true }); 
    trailOnUpdate([ 
      Constants.CATEGORIES.bullet.cpu, 
      Constants.CATEGORIES.bullet.player ],
      Constants.TRAIL_BULLET_SIZE);
    trailOnUpdate(
      [ Constants.CATEGORIES.particle ],
      Constants.TRAIL_PARTICLE_SIZE);
    removeSleepingOnUpdate(
      [ Constants.CATEGORIES.particle, Constants.CATEGORIES.trail ]);
  }

  const trackMousePosition = () =>
    Matter.Events.on($engine, "afterUpdate", () => mouse.set($mouse));
    
  const trackCurrentPlayerVelocity = () =>
    currentPlayerVelocity.subscribe(n => $render.shotIndicatorVelocity = n);

  const trackCurrentPlayerDegrees = () =>
    currentPlayerDegrees.subscribe(n => $render.shotIndicatorDegrees = n);

  const playerFireOnClick = () =>
    Matter.Events.on($mouseConstraint, "mousedown", (event) => {
      if (!$isShootingEnabled) {
        return;
      }
    
      mousedownPosition.set(event.mouse.mousedownPosition);
      fire({
        fromBody: $player,
        offset: Constants.PLAYER_LENGTH,
        rads: $playerRadians,
        velocity: $playerVelocity,
        collisionFilter: Constants.COLLISION_FILTERS.bullets.player
      });
      fireCount.update(n => n + 1);
      populateWorld(Factory.createLastShotIndicator($mousedownPosition));
    });

  const cpuFireOnCpuTurn = () =>
    isPlayerTurn.subscribe(fireIfCpuTurn);

  const fireIfCpuTurn = (isNowPlayerTurn) => {
    if (isNowPlayerTurn) {
      return;
    }
    fire({
      fromBody: $cpu,
      offset: Constants.CPU_LENGTH,
      rads: Service.randomise($cpuRadians, Constants.CPU_ANGLE_RANDOMNESS_FACTOR),
      velocity: Service.getRandomInRange(Constants.CPU_VELOCITY_MIN, Constants.CPU_VELOCITY_MAX),
      collisionFilter: Constants.COLLISION_FILTERS.bullets.cpu
    });
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
        populateWorld(Factory.createParticles(bullet));
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
        .forEach(bodyToTrail => populateWorld(Factory.createTrail(bodyToTrail, trailSize))));

  const removeSleepingOnUpdate = (categoriesToRemove) => 
    Matter.Events.on($engine, "afterUpdate", (event) =>
      getAllBodies()
        .filter(body => body.isSleeping)
        .filter(sleepingBody => categoriesToRemove.includes(sleepingBody.collisionFilter.category))
        .forEach(removeFromWorld));

  const populateWorld = (objectsToAdd) =>
    Matter.World.add($world, objectsToAdd);

  const fire = (options) => {
    isShotInProgress.set(true);
    let bullet = Factory.createBullet(
      options.fromBody,
      options.offset,
      options.rads,
      options.collisionFilter);

    populateWorld(bullet);
    Matter.Body.applyForce(
      bullet,
      bullet.position,
      Factory.createBulletForce(options.rads, options.velocity));
  }

  const removeFromWorld = (objectsToRemove) =>
    Matter.World.remove($world, objectsToRemove);

  const getAllBodies = () =>
    Matter.Composite.allBodies($world);

</script>

<div>
  level: {$level}
</div>
<div>
  player score: {$playerScore}
</div>
<div>
  cpu score: {$cpuScore}
</div>
<div>
  last velocity: {$lastPlayerVelocity || "N/A"}
</div>
<div>
  last angle: {$lastPlayerDegrees || "N/A"}
</div>
<div>
  {#if $isShootingEnabled}
    <b>click to fire.</b>
  {:else if $isPlayerTurn}
    player shot in progress...
  {:else if !$isPlayerTurn}
    cpu shot in progress...
  {/if}
</div>

<div id="{Constants.CANVAS_ID}"/>