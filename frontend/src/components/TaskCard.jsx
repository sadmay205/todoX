import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useState } from "react";

function TaskCard({ task, index, onDataChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
  const [isLoading, setIsLoading] = useState(false);

  const deleteTask = async () => {
    try {
      setIsLoading(true);
      await api.delete(`tasks/${task._id}`);
      toast.success(`Deleted task "${task.title}"`);

      if (onDataChange) onDataChange();
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CẬP NHẬT TÊN ---
  const updateTask = async () => {
    if (!updateTaskTitle.trim() || updateTaskTitle === task.title) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await api.put(`tasks/${task._id}`, {
        title: updateTaskTitle,
      });
      toast.success("Task updated!");
      setIsEditing(false);

      if (onDataChange) onDataChange();
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HÀM TOGGLE STATUS ---
  const toggleStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = task.status === "completed" ? "active" : "completed";

      await api.put(`tasks/${task._id}`, { status: newStatus });

      if (onDataChange) onDataChange();
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateTask();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75 bg-slate-800/40"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          onClick={toggleStatus}
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              autoFocus
              placeholder="Task title..."
              className="flex-1 h-8 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-slate-900/50"
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={updateTask}
              disabled={isLoading}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200 font-medium truncate cursor-pointer",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-slate-800"
              )}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-success">
                  Done: {new Date(task.completedAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            className="shrink-0 size-8 text-muted-foreground hover:text-info hover:bg-info/10"
            onClick={() => {
              setIsEditing(true);
              setUpdateTaskTitle(task.title);
            }}
          >
            <SquarePen className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            className="shrink-0 size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={deleteTask}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TaskCard;
