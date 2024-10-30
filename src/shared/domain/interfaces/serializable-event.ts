/**
 * Serialized event payload
 * Iterates over the object and serializes it
 * If the property has a toJSON method, it will infer the return type
 *
 * @template T Event Data Type
 */
export type SerializedEventPayload<T> = T extends Object
  ? {
      [K in keyof T]: T[K] extends { toJSON(): infer U }
        ? U
        : SerializedEventPayload<T[K]>;
    }
  : T;

/**
 * Serializable event that can be stored in the event store
 * @template T Event Data Type
 */
export interface SerializableEvent<T = any> {
  streamId: string;
  type: string;
  position: number;
  data: SerializedEventPayload<T>;
}
