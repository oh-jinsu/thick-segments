import type { Scene } from "./scene";

export class SceneRenderer {
  protected ratio = window.devicePixelRatio * 2;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected rect = new DOMRect();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  resize() {
    this.rect = this.canvas.getBoundingClientRect();

    this.canvas.width = this.canvas.clientWidth * this.ratio;

    this.canvas.height = this.canvas.clientHeight * this.ratio;

    const context = this.canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
  }

  render(scene: Scene): void {
    this.resize();
    scene.camera.rect = {
      top: this.rect.top,
      right: this.rect.right,
      bottom: this.rect.bottom,
      left: this.rect.left,
      width: this.rect.width,
      height: this.rect.height,
    };
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    scene.onRender(this.ctx);
  }
}
