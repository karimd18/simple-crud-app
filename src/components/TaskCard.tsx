import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusColors = {
  'todo': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-accent text-accent-foreground',
  'done': 'bg-primary text-primary-foreground',
};

const priorityColors = {
  'low': 'border-muted',
  'medium': 'border-accent',
  'high': 'border-destructive',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': 'todo',
  };

  return (
    <Card className={cn(
      "p-6 transition-all duration-300 hover:shadow-lg border-l-4",
      priorityColors[task.priority]
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{task.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Badge
          className={cn("cursor-pointer", statusColors[task.status])}
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
        >
          {task.status}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {task.priority} priority
        </Badge>
      </div>
    </Card>
  );
};
