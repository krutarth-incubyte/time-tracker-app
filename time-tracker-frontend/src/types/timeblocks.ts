export interface Timeblock {
  id: number;
  taskId: number;
  start: Date;
  end: Date;
  description: string;
  createdAt: Date;
}

export interface AddTimeblockSchema {
  description: string;
  start: Date;
  end: Date;
  taskId: number;
}
