export class CreateTaskDto {
  title: string;
  description: string;
  parentTaskId?: number;
}
