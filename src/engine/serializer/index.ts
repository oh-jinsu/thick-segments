import type { SceneNode, BaseSceneNodeProps } from "../node";

export type SerializedSceneNode = {
  props: BaseSceneNodeProps;
  children: SerializedSceneNode[];
};

export interface SceneNodeSerializer {
  serialize(scene: SceneNode): SerializedSceneNode;

  deserialize(json: SerializedSceneNode): SceneNode;
}
