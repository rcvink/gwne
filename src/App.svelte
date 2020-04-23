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
    hasHitCpu,
    hasHitPlayer,
    playerRadians,
    fireCount,
    cpu,
    cpuRadians,
    } from './stores.js';

  onMount(() => {
    setupMatter();
    let planet = factory.createPlanet(680, 480, 120);
    player.set(factory.createPlayer(250, 250, 20));
    cpu.set(factory.createCpu(530, 20, 20));
    cpuFireOnPlayerFire($cpuRadians);
    setFlagTrueOnHit($cpu.id, hasHitCpu);
    setFlagTrueOnHit($player.id, hasHitPlayer);
    explodeOnHitFromAnyBullet($cpu.id);
    explodeOnHitFromAnyBullet($player.id);
    explodeOnHitFromAnyBullet(planet.id);
    trailOnUpdate([ 
      CONSTANTS.CATEGORIES.bullet.cpu, 
      CONSTANTS.CATEGORIES.bullet.player ], 2);
    trailOnUpdate(
      [ CONSTANTS.CATEGORIES.particle ], 1);
    removeSleepingOnUpdate(
      [ CONSTANTS.CATEGORIES.particle, CONSTANTS.CATEGORIES.trail ]);
    populateWorld([ planet, $player, $cpu ]);
  });

  const setupMatter = () => {
    Matter.use(MatterAttractors);
    render.set(factory.createRender(document, "canvas", $engine));
    Matter.Runner.run($runner, $engine);
    Matter.Render.run($render);
    $engine.world.gravity.scale = 0;
    world.set($engine.world);
  }

  const cpuFireOnPlayerFire = (rads) =>
    fireCount.subscribe((newValue) => {
      if (newValue > 0) {
        fire(
          $cpu, rads, CONSTANTS.CPU_BULLET_VELOCITY, CONSTANTS.COLLISION_FILTERS.bullets.cpu);
      }
    });

  const setFlagTrueOnHit= (bodyId, flag) =>
    Matter.Events.on($engine, "collisionStart", (event) => {
      let pairs = event.pairs[0];
      if (pairs.bodyA.id === bodyId || pairs.bodyB.id === bodyId) {
        flag.set(true);
      }
    });

  const explodeOnHitFromAnyBullet = (idOfSurvivingBody) =>
    Matter.Events.on($engine, "collisionStart", (event) => {
      let bullet;
      let pairs = event.pairs[0];

      if (pairs.bodyA.id === idOfSurvivingBody) {
        bullet = pairs.bodyB;
      } else if (pairs.bodyB.id === idOfSurvivingBody) {
        bullet = pairs.bodyA;
      } else {
        return null;
      }

      let particles = factory.createParticles(bullet);
      populateWorld(particles);
      removeFromWorld(bullet);
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
      $bulletSettings.size, 
      collisionFilter);

    populateWorld(bullet);
    Matter.Body.applyForce(
      bullet,
      bullet.position,
      factory.createBulletForce(rads, velocity));
  }

  const removeFromWorld = (objectsToRemove) => {
    Matter.World.remove($world, objectsToRemove);
  }

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
  size:
  <input type="number" bind:value={$bulletSettings.size} min="3" max="20"/>
</div>
<div>
  angle:
  <input type="number" bind:value={$bulletSettings.angleDegrees} min="0" max="359"/>
</div>
<div>
  velocity:
  <input type="number" bind:value={$bulletSettings.velocity} min="1" max="10"/>
</div>
<div>
  {#if $hasHitPlayer}
    Hit player!
  {:else}
    Player OK.
  {/if}
</div>
<div>
  {#if $hasHitCpu}
    Hit CPU!
  {:else}
    CPU OK.
  {/if}
</div>
<div>
  {$fireCount} shots fired.
</div>
<div id="canvas" on:click={onClick}/>
