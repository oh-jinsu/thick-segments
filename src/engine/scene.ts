import { Camera } from "./camera";
import { SceneNode } from "./node";
import type { SceneNodeSerializer } from "./serializer";

/**
 * Scene should be serializable
 */
export class Scene extends SceneNode {
  private _camera: Camera | undefined = undefined;

  get camera(): Camera {
    if (!this._camera) {
      this._camera = this.findChildOf(Camera);

      if (!this._camera) {
        throw new Error("Scene must have a Camera node.");
      }
    }

    return this._camera;
  }

  serializer: SceneNodeSerializer | null = null;

  get scene(): Scene {
    return this;
  }

  constructor() {
    super({});
  }

  enableSerializer(serializer: SceneNodeSerializer): void {
    this.serializer = serializer;
  }
}
