import type { Camera } from "./camera";
import type { ControlEvent } from "./control_event";
import type { Scene } from "./scene";

/**
 * SceneNode should be serializable
 */
export type BaseSceneNodeProps = {
  id: string;
};

export type SceneNodeProps<T extends Record<string, unknown>> = T &
  BaseSceneNodeProps;

export class SceneNode<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  parent: SceneNode | null = null;
  props: SceneNodeProps<T>;
  children: SceneNode[] = [];

  get scene(): Scene {
    if (!this.parent) {
      throw new Error("SceneNode must have a parent to access the scene.");
    }

    return this.parent?.scene;
  }

  get camera(): Camera {
    return this.scene.camera;
  }

  constructor(props: Omit<T, "id"> & { id?: string }) {
    this.props = {
      ...props,
      id: props?.id || crypto.randomUUID(), // Ensure each node has a unique ID
    } as SceneNodeProps<T>;
  }

  addChild(...children: SceneNode[]): void {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
    }
  }

  removeChild(...children: SceneNode[]): void {
    for (const child of children) {
      this.children = this.children.filter((c) => c !== child);
      child.parent = null;
    }
  }

  findChild(id: string, recursive = false): SceneNode | undefined {
    for (const child of this.children) {
      if (child.props.id === id) {
        return child;
      }

      if (recursive) {
        const found = child.findChild(id, true);

        if (found) {
          return found;
        }
      }
    }
  }

  findChildOf<T extends SceneNode>(
    type: new (props: never) => T,
    recursive = false
  ): T | undefined {
    for (const child of this.children) {
      if (child instanceof type) {
        return child as T;
      }

      if (recursive) {
        const found = child.findChildOf(type, true);

        if (found) {
          return found;
        }
      }
    }
  }

  findChildrenOf<T extends SceneNode>(
    type: new (props: never) => T,
    recursive = false
  ): T[] {
    const found: T[] = [];

    for (const child of this.children) {
      if (child instanceof type) {
        found.push(child as T);
      }

      if (recursive) {
        found.push(...child.findChildrenOf(type, true));
      }
    }

    return found;
  }

  clone(): SceneNode<T> {
    const serializer = this.scene.serializer;

    if (!serializer) {
      throw new Error("SceneNode serializer is not enabled.");
    }

    const serialized = serializer.serialize(this);

    const cloned = serializer.deserialize(serialized);

    cloned.parent = this.parent;

    return cloned as SceneNode<T>;
  }

  onRender(ctx: CanvasRenderingContext2D): void {
    this.render(ctx);
    for (const child of this.children) {
      child.onRender(ctx);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(ctx: CanvasRenderingContext2D): void {}

  onPointerDown(event: ControlEvent): void {
    this.pointerDown(event);
    if (event.stopRequest) {
      return;
    }
    for (const child of this.children) {
      if (event.stopRequest) {
        return;
      }
      child.pointerDown(event);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerDown(event: PointerEvent): void {}

  onPointerMove(event: ControlEvent): void {
    this.pointerMove(event);
    if (event.stopRequest) {
      return;
    }
    for (const child of this.children) {
      if (event.stopRequest) {
        return;
      }
      child.pointerMove(event);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerMove(event: PointerEvent): void {}

  onPointerUp(event: ControlEvent): void {
    this.pointerUp(event);
    if (event.stopRequest) {
      return;
    }
    for (const child of this.children) {
      if (event.stopRequest) {
        return;
      }
      child.pointerUp(event);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerUp(event: PointerEvent): void {}
}
