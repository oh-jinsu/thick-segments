import { SceneNode } from "./node";
import type { Vector2 } from "./types";

export type CameraProps = {
  position: Vector2;
  scale: number;
};

export type CameraRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export class Camera extends SceneNode<CameraProps> {
  private initialWidth?: number;

  private _rect: CameraRect | null = null;

  get rect() {
    if (!this._rect) {
      throw new Error(
        "Camera rect is not set. Please set the camera rect before using it."
      );
    }

    return this._rect;
  }

  set rect(rect: CameraRect) {
    if (!this._rect) {
      if (this.initialWidth) {
        this.props.scale = rect.width / this.initialWidth;
      }
    }
    this._rect = rect;
  }

  constructor({ initialWidth }: { initialWidth?: number }) {
    super({
      position: { x: 0, y: 0 },
      scale: 1,
    });

    this.initialWidth = initialWidth;
  }

  toCanvas(point: Vector2): Vector2 {
    return {
      x: (point.x - this.props.position.x) * this.props.scale + this.rect.left,
      y: (point.y - this.props.position.y) * this.props.scale + this.rect.top,
    };
  }

  toWorld(point: Vector2): Vector2 {
    return {
      x: (point.x - this.rect.left) / this.props.scale + this.props.position.x,
      y: (point.y - this.rect.top) / this.props.scale + this.props.position.y,
    };
  }
}
