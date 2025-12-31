import { Circle } from "lucide-react";
import { Card } from "./ui/card";

function TaskEmptyState({ filter }) {
  return (
    <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
      <div className="space-y-3">
        <Circle className="size-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="font-medium text-foreground">
            {filter === "active"
              ? "No active tasks"
              : filter === "completed"
              ? "No completed tasks"
              : "No tasks"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {filter === "all"
              ? "Add a task to get started"
              : `Move to all tasks to get started ${
                  filter === "acitve" ? "active" : "completed"
                }`}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TaskEmptyState;
