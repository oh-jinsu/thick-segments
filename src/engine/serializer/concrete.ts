import type { SceneNodeSerializer, SerializedSceneNode } from ".";
import { deepCopy } from "../copy";
import { SceneNode } from "../node";

export class ConcreteSceneNodeSerializer implements SceneNodeSerializer {
  serialize(scene: SceneNode): SerializedSceneNode {
    return {
      props: deepCopy(scene.props),
      children: scene.children.map((child) => this.serialize(child)),
    };
  }

  deserialize(json: SerializedSceneNode): SceneNode {
    const { props, children } = json;

    const node = new SceneNode(props);

    node.children = children.map((json) => {
      const child = this.deserialize(json);
      child.parent = node;
      return child;
    });

    return node;
  }
}
