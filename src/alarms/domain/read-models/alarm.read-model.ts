// Alarm Read Model is optimized for read operations, and only contain data that needs
// to be displayed to the user(excludes unwanted datas like metadatas, etc if existed).
// It is a denormalized version of the Alarm domain model (and should match the Mongoose Materialized Schema).
export class AlarmReadModel {
  id: string;
  name: string;
  severity: string;
  trigerredAt: Date;
  isAcknowledged: boolean;
  items = new Array<{ name: string; type: string }>();
}
