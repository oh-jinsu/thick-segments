import { Point, Polygon, Vector } from "@flatten-js/core";
import { SceneNode } from "../engine/node";
import type { Vector2 } from "../engine/types";

export type SegmentNodeProps = {
  start: Vector2;
  end: Vector2;
  thickness: number;
};

export class SegmentNode extends SceneNode<SegmentNodeProps> {
  grabbed = false;

  get shape(): Polygon {
    const ps = new Point(this.props.start.x, this.props.start.y);
    const pe = new Point(this.props.end.x, this.props.end.y);

    const vector = new Vector(ps, pe).normalize();
    const normal = vector.rotate90CCW();

    const ps1 = ps.translate(normal.multiply(this.props.thickness * 0.5));
    const ps2 = ps.translate(normal.multiply(-this.props.thickness * 0.5));
    const pe1 = pe.translate(normal.multiply(this.props.thickness * 0.5));
    const pe2 = pe.translate(normal.multiply(-this.props.thickness * 0.5));

    return new Polygon([ps1, ps2, pe2, pe1]);
  }

  render(ctx: CanvasRenderingContext2D): void {
    // const ps = new Point(this.props.start.x, this.props.start.y);
    // const pe = new Point(this.props.end.x, this.props.end.y);
    // if (ps.equalTo(pe)) {
    //   return;
    // }
    // ctx.beginPath();
    // const points = this.shape.vertices.map((v) => {
    //   return this.camera.toCanvas({
    //     x: v.x,
    //     y: v.y,
    //   });
    // });
    // ctx.moveTo(points[0].x, points[0].y);
    // for (const point of points) {
    //   ctx.lineTo(point.x, point.y);
    // }
    // ctx.lineTo(points[0].x, points[0].y);
    // ctx.closePath();
    // ctx.fillStyle = "#FF0000";
    // ctx.strokeStyle = "#000000";
    // ctx.lineWidth = 1;
    // ctx.stroke();
  }

  pointerDown(event: PointerEvent): void {
    if (!this.grabbed) {
      return;
    }

    const end = this.camera.toWorld({
      x: event.clientX,
      y: event.clientY,
    });

    this.props.end = end;

    this.grabbed = false;

    event.stopPropagation();
  }

  pointerMove(event: PointerEvent): void {
    if (!this.grabbed) {
      return;
    }

    const end = this.camera.toWorld({
      x: event.clientX,
      y: event.clientY,
    });

    this.props.end = end;

    event.stopPropagation();
  }
}
