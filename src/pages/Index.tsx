import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { StatsCard } from "@/components/StatsCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, TaskStatus } from "@/types/task";
import { Plus, Search, ListTodo, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title!,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    toast.success('Task created successfully!');
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    setEditingTask(undefined);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    toast.success('Task status updated!');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTask(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Task Manager</h1>
            <p className="text-muted-foreground">Organize your work efficiently</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={ListTodo}
            color="bg-primary/10 text-primary"
          />
          <StatsCard
            title="To Do"
            value={stats.todo}
            icon={ListTodo}
            color="bg-muted text-muted-foreground"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="bg-accent/20 text-accent-foreground"
          />
          <StatsCard
            title="Completed"
            value={stats.done}
            icon={CheckCircle2}
            color="bg-primary/20 text-primary"
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Create your first task to get started'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
};

export default Index;
