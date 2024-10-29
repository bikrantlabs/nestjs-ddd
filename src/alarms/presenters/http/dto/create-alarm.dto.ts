// We can add validation rules here.
export class CreateAlarmDto {
  name: string;
  severity: string;
  trigerredAt: Date;
  items: Array<{ name: string; type: string }>;
}
