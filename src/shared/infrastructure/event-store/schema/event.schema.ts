import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Event {
  @Prop()
  streamId: string;

  @Prop()
  type: string;

  @Prop()
  position: number;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  data: Record<string, any>;
}
export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ streamId: 1, position: 1 }, { unique: true });
