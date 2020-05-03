<script>
  import Matter from "matter-js";
  import MatterAttractors from "matter-attractors";
  import { onMount } from "svelte";

  import BodyFactory from "./factories/BodyFactory";
  import Categories from "./constants/Categories";
  import CollisionFilters from "./constants/CollisionFilters";
  import Dimensions from "./constants/Dimensions";
  import ExplosionOptions from "./constants/ExplosionOptions";
  import GameFactory from "./factories/GameFactory";
  import GravityService from "./services/GravityService";
  import EngineListeners from "./listeners/EngineListeners";
  import Physics from "./constants/Physics";
  import RandomService from "./services/RandomService";
  import Render from "./Render";
  import VectorService from "./services/VectorService";

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
  } from "./stores/writable";

  import {
    currentPlayerDegrees,
    currentPlayerVelocity,
    playerRadians,
    lastPlayerDegrees,
    playerVelocity,
    lastPlayerVelocity,
    cpuRadians,
    isShootingEnabled
  } from "./stores/derived";

  const canvasId = "canvas";

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
    engine.set(GameFactory.createEngine());
    render.set(GameFactory.createRender(document, $engine, canvasId));
    runner.set(GameFactory.createRunner());
    GravityService.setGravityZero($engine);
    world.set($engine.world);
  };

  const runMatter = () => {
    Matter.Runner.run($runner, $engine);
    Render.run($render);
  };

  const setupMouse = () => {
    mouse.set(GameFactory.createMouse($render.canvas));
    mouseConstraint.set(GameFactory.createMouseConstraint($engine, $mouse));
    $render.mouse = $mouse;
  };

  const setWalls = () =>
    walls.set(
      BodyFactory.createWalls($render.options.width, $render.options.height)
    );

  const startNewLevel = () => {
    removeFromWorld(getAllBodies());
    planet.set(
      BodyFactory.createPlanet($render.options.width, $render.options.height)
    );
    player.set(
      BodyFactory.createPlayer($render.options.width, $render.options.height)
    );
    $render.playerPosition = $player.position;
    cpu.set(
      BodyFactory.createCpu($render.options.width, $render.options.height)
    );
    populateWorld([$planet, $player, $cpu, ...$walls, $mouseConstraint]);
    level.update(n => n + 1);
    fireCount.set(0);
    isPlayerTurn.set(true);
  };

  const registerPermanentListeners = () => {
    EngineListeners.trackMousePosition($engine, mouse, $mouse);
    trackCurrentPlayerVelocity();
    trackCurrentPlayerDegrees();
    playerFireOnClick();
    cpuFireOnCpuTurn();
    EngineListeners.winOrLoseOnHit(
      $engine,
      $cpu.id,
      $player.id,
      playerScore,
      cpuScore,
      startNewLevel
    );
    EngineListeners.bulletsExplodeOnCollisionWithCategory(
      $engine,
      Categories.CPU,
      isShotInProgress,
      isPlayerTurn,
      bullet => populateWorld(BodyFactory.createParticles(bullet)),
      removeFromWorld,
      ExplosionOptions.PARTICIPANT
    );
    EngineListeners.bulletsExplodeOnCollisionWithCategory(
      $engine,
      Categories.PLAYER,
      isShotInProgress,
      isPlayerTurn,
      bullet => populateWorld(BodyFactory.createParticles(bullet)),
      removeFromWorld,
      ExplosionOptions.PARTICIPANT
    );
    EngineListeners.bulletsExplodeOnCollisionWithCategory(
      $engine,
      Categories.PLANET,
      isShotInProgress,
      isPlayerTurn,
      bullet => populateWorld(BodyFactory.createParticles(bullet)),
      removeFromWorld,
      ExplosionOptions.PLANET
    );
    EngineListeners.bulletsExplodeOnCollisionWithCategory(
      $engine,
      Categories.WALL,
      isShotInProgress,
      isPlayerTurn,
      () => {},
      removeFromWorld,
      ExplosionOptions.WALL
    );
    EngineListeners.trailOnUpdate(
      $engine,
      getAllBodies,
      [Categories.BULLET.CPU, Categories.BULLET.PLAYER],
      bodyToTrail =>
        populateWorld(
          BodyFactory.createTrail(bodyToTrail, Dimensions.TRAIL_BULLET_SIZE)
        )
    );
    EngineListeners.trailOnUpdate(
      $engine,
      getAllBodies,
      [Categories.PARTICLE],
      bodyToTrail =>
        populateWorld(
          BodyFactory.createTrail(bodyToTrail, Dimensions.TRAIL_PARTICLE_SIZE)
        )
    );
    EngineListeners.removeSleepingOnUpdate(
      $engine,
      getAllBodies,
      [Categories.PARTICLE, Categories.TRAIL],
      removeFromWorld
    );
  };

  const trackCurrentPlayerVelocity = () =>
    currentPlayerVelocity.subscribe(n => ($render.shotIndicatorVelocity = n));

  const trackCurrentPlayerDegrees = () =>
    currentPlayerDegrees.subscribe(n => ($render.shotIndicatorDegrees = n));

  const playerFireOnClick = () =>
    Matter.Events.on($mouseConstraint, "mousedown", event => {
      if (!$isShootingEnabled) {
        return;
      }

      mousedownPosition.set(event.mouse.mousedownPosition);
      fire({
        fromBody: $player,
        offset: Dimensions.PLAYER_LENGTH,
        rads: $playerRadians,
        velocity: $playerVelocity,
        collisionFilter: CollisionFilters.BULLETS.PLAYER
      });
      fireCount.update(n => n + 1);
      populateWorld(BodyFactory.createLastShotIndicator($mousedownPosition));
    });

  const cpuFireOnCpuTurn = () => isPlayerTurn.subscribe(fireIfCpuTurn);

  const fireIfCpuTurn = isNowPlayerTurn => {
    if (isNowPlayerTurn) {
      return;
    }
    fire({
      fromBody: $cpu,
      offset: Dimensions.CPU_LENGTH,
      rads: RandomService.randomise(
        $cpuRadians,
        Dimensions.CPU_ANGLE_RANDOMNESS_FACTOR
      ),
      velocity: RandomService.getRandomInRange(
        Physics.CPU_VELOCITY_MIN,
        Physics.CPU_VELOCITY_MAX
      ),
      collisionFilter: CollisionFilters.BULLETS.CPU
    });
  };

  const populateWorld = objectsToAdd => Matter.World.add($world, objectsToAdd);

  const fire = options => {
    isShotInProgress.set(true);
    let bullet = BodyFactory.createBullet(
      options.fromBody,
      options.offset,
      options.rads,
      options.collisionFilter
    );

    populateWorld(bullet);
    Matter.Body.applyForce(
      bullet,
      bullet.position,
      VectorService.createBulletForce(options.rads, options.velocity)
    );
  };

  const removeFromWorld = objectsToRemove =>
    Matter.World.remove($world, objectsToRemove);

  const getAllBodies = () => Matter.Composite.allBodies($world);
</script>

<div>level: {$level}</div>
<div>player score: {$playerScore}</div>
<div>cpu score: {$cpuScore}</div>
<div>last velocity: {$lastPlayerVelocity || 'N/A'}</div>
<div>last angle: {$lastPlayerDegrees || 'N/A'}</div>
<div>
  {#if $isShootingEnabled}
    <b>click to fire.</b>
  {:else if $isPlayerTurn}
    player shot in progress...
  {:else if !$isPlayerTurn}cpu shot in progress...{/if}
</div>

<div id={canvasId} />
