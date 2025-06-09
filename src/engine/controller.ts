import type { ControlEvent } from "./control_event";
import type { Scene } from "./scene";

export class SceneController {
  protected scene: Scene;
  protected element: HTMLElement | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  bindElement(element: HTMLElement): void {
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.element = element;
    this.element.addEventListener("pointerdown", this.onPointerDown);
    this.element.addEventListener("pointermove", this.onPointerMove);
    this.element.addEventListener("pointerup", this.onPointerUp);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected createControlEvent(event: any): ControlEvent {
    event.stopRequest = false;
    event.stopPropagation = () => {
      event.stopRequest = true;
    };

    return event as ControlEvent;
  }

  onPointerDown(event: PointerEvent): void {
    const controlEvent = this.createControlEvent(event);

    this.scene.onPointerDown(controlEvent);
  }

  onPointerMove(event: PointerEvent): void {
    const controlEvent = this.createControlEvent(event);

    this.scene.onPointerMove(controlEvent);
  }

  onPointerUp(event: PointerEvent): void {
    const controlEvent = this.createControlEvent(event);

    this.scene.onPointerUp(controlEvent);
  }

  dispose(): void {
    this.element?.removeEventListener("pointerdown", this.onPointerDown);
    this.element?.removeEventListener("pointermove", this.onPointerMove);
    this.element?.removeEventListener("pointerup", this.onPointerUp);
  }
}
