import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

function AddTask({ onTaskAdded }) {
  const [newTasktitle, setNewTaskTitle] = useState("");

  const addTask = async () => {
    if (newTasktitle.trim()) {
      try {
        await api.post("tasks", {
          title: newTasktitle,
        });
        toast.success(`Task "${newTasktitle}" added successfully!`);

        // Reset ô nhập liệu
        setNewTaskTitle("");

        // 3. Gọi hàm callback để HomePage load lại danh sách
        if (onTaskAdded) {
          onTaskAdded();
        }
      } catch (err) {
        console.error("Error adding task:", err);
        toast.error("Error adding task");
      }
    } else {
      toast.error("Task title cannot be empty");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-log">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="What needs to be done?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTasktitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyPress} // React dùng onKeyDown tốt hơn onKeyPress
        />
        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask}
          disabled={!newTasktitle.trim()}
        >
          <Plus className="size-5" />
          Add
        </Button>
      </div>
    </Card>
  );
}

export default AddTask;
