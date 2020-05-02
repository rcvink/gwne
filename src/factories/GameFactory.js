import Matter from 'matter-js'
import Render from '../Render';
import Constants from '../Constants'
import Dimensions from '../constants/Dimensions';

const createEngine = () =>
  Matter.Engine.create({enableSleeping: true});

const createRunner = () =>
  Matter.Runner.create();

const createRender = (document, engine) =>
  Render.create({
    element: document.getElementById(Constants.CANVAS_ID),
    engine,
    options: {
      width: Math.min(
        document.documentElement.clientWidth, 
        Dimensions.RENDER_MAX_WIDTH),
      height: Math.min(
        document.documentElement.clientHeight, 
        Dimensions.RENDER_MAX_HEIGHT),
      showShotIndicator: true
    }
  });

const createMouse = (canvas) =>
  Matter.Mouse.create(canvas);

const createMouseConstraint = (engine, mouse) => 
  Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { render: { visible: false } }
  });

export default {
  createEngine,
  createRunner,
  createRender,
  createMouse,
  createMouseConstraint,
};
