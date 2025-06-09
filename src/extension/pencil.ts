import { Point, Segment } from "@flatten-js/core";
import { SceneNode } from "../engine/node";
import { SegmentNode } from "./segment";

export type PencilNodeProps = {
  outlineColor: string;
  outlineWidth: number;
  fillColor: string;
  thickness: number;
};

export class PencilNode extends SceneNode<PencilNodeProps> {
  pointerDown(event: PointerEvent): void {
    const segments = this.scene.findChildrenOf(SegmentNode);

    if (segments.some((segment) => segment.grabbed)) {
      return;
    }

    const start = this.camera.toWorld({
      x: event.clientX,
      y: event.clientY,
    });

    const segment = new SegmentNode({
      start,
      end: { x: start.x, y: start.y },
      thickness: this.props.thickness,
    });

    this.scene.addChild(segment);

    segment.grabbed = true;

    event.stopPropagation();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const segments = this.scene
      .findChildrenOf(SegmentNode)
      .filter((segment) => {
        const ps = new Point(segment.props.start.x, segment.props.start.y);
        const pe = new Point(segment.props.end.x, segment.props.end.y);
        return !ps.equalTo(pe);
      });

    const shapes = segments.map((segment) => segment.shape);

    const surfaces = shapes.flatMap((shape) => {
      return shape.vertices.map((p, i, arr) => {
        return new Segment(p, arr[(i + 1) % arr.length]);
      });
    });

    const splitted = surfaces.flatMap((segment) => {
      const intersections = surfaces
        .filter((s) => s !== segment)
        .flatMap((other) => other.intersect(segment));

      const points = [segment.ps, segment.pe, ...intersections]
        .filter(
          (point, i, arr) => !arr.slice(i + 1).some((p) => p.equalTo(point))
        )
        .sort(
          (a, b) =>
            a.distanceTo(segment.start)[0] - b.distanceTo(segment.start)[0]
        );

      return points.slice(0, -1).map((point, i) => {
        const ps = point;
        const pe = points[i + 1];
        return new Segment(ps, pe);
      });
    });

    const outlines = splitted.filter((s) => {
      let count = 0;

      for (const segment of segments) {
        if (segment.shape.contains(s)) {
          count++;
        }

        if (count === 2) {
          return false;
        }
      }

      return true;
    });

    for (const shape of shapes) {
      const start = this.camera.toCanvas({
        x: shape.vertices[0].x,
        y: shape.vertices[0].y,
      });

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < shape.vertices.length; i++) {
        const vertex = shape.vertices[i];
        const point = this.camera.toCanvas({ x: vertex.x, y: vertex.y });
        ctx.lineTo(point.x, point.y);
      }

      ctx.closePath();
      ctx.fillStyle = this.props.fillColor;
      ctx.fill();
    }

    for (const segment of outlines) {
      const start = this.camera.toCanvas({
        x: segment.ps.x,
        y: segment.ps.y,
      });

      const end = this.camera.toCanvas({
        x: segment.pe.x,
        y: segment.pe.y,
      });

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = this.props.outlineWidth;
      ctx.strokeStyle = this.props.outlineColor;
      ctx.stroke();
    }
  }
}
