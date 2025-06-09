import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Scene } from "./engine/scene";
import { SceneRenderer } from "./engine/scene_renderer";
import { Camera } from "./engine/camera";
import { PencilNode } from "./extension/pencil";
import { SceneController } from "./engine/controller";

const outlineColor = "#000000"; // Default outline color
const outlineWidth = 1; // Default outline width
const fillColor = "#FFFFFF"; // Default fill color
const thickness = 10; // Default thickness

function App() {
  const ref = useRef<HTMLCanvasElement>(null);

  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    const scene = new Scene();

    scene.addChild(
      new Camera({
        initialWidth: 1000,
      }),
      new PencilNode({
        outlineColor,
        outlineWidth,
        fillColor,
        thickness,
      })
    );

    setScene(scene);
  }, []);

  useEffect(() => {
    if (!scene) {
      return;
    }

    const canvas = ref.current;

    if (!canvas) {
      return;
    }

    const renderer = new SceneRenderer(canvas);

    let frame = 0;

    const ticker = () => {
      frame = requestAnimationFrame(ticker);

      renderer.render(scene);
    };

    ticker();

    const controller = new SceneController(scene);

    controller.bindElement(canvas);

    return () => {
      controller.dispose();
      cancelAnimationFrame(frame);
    };
  }, [scene]);

  if (!scene) {
    return null;
  }

  const pencilNode = scene?.findChildOf(PencilNode);

  return (
    <>
      <canvas id="canvas" ref={ref} />
      <div id="controls">
        <div className="row">
          <label>
            외곽선 색&nbsp;
            <input
              type="color"
              defaultValue={outlineColor}
              onChange={(e) => {
                if (pencilNode) {
                  pencilNode.props.outlineColor = e.target.value;
                }
              }}
            />
          </label>
        </div>
        <div className="row">
          <label>
            채우기 색&nbsp;
            <input
              type="color"
              defaultValue={fillColor}
              onChange={(e) => {
                if (pencilNode) {
                  pencilNode.props.fillColor = e.target.value;
                }
              }}
            />
          </label>
        </div>
        <div className="row">
          <label>
            선분 두께&nbsp;
            <input
              type="number"
              defaultValue={thickness}
              min={1}
              max={100}
              onChange={(e) => {
                if (pencilNode) {
                  pencilNode.props.thickness = parseInt(e.target.value, 10);
                }
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
}

export default App;
