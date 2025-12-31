import Header from "@/components/Header";
import AddTask from "@/components/AddTask";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

function HomePage() {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      const { tasks, activeCount, completedCount } = res.data;

      setTaskBuffer(tasks || []);
      setActiveTaskCount(activeCount || 0);
      setCompletedTaskCount(completedCount || 0);

      console.log(`Loaded tasks for: ${dateQuery}`, res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Error fetching tasks");
      setTaskBuffer([]);
    }
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  useEffect(() => {
    if (page > 1 && page > totalPages && totalPages > 0) {
      setPage((prev) => prev - 1);
    }
  }, [page, totalPages]);

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refreshTasks = () => {
    fetchTasks();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-slate-100 bg-slate-900">
      <style>{`
        @keyframes crystal-shimmer {
          0%, 100% { 
            background-position: 0% 0%, 0% 0%, 0% 0%, 50% 50%;
            background-size: 10px 10px, 10px 10px, 200% 200%, 200% 200%;
          }
          50% { 
            background-position: 1px 1px, -1px -1px, 100% 100%, 50% 50%;
            background-size: 12px 12px, 12px 12px, 200% 200%, 180% 180%;
          }
        }
      `}</style>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(60deg, transparent 0px, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px),
            repeating-linear-gradient(-60deg, transparent 0px, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px),
            linear-gradient(60deg, rgba(43, 108, 176, 0.4) 0%, rgba(72, 126, 176, 0.4) 33%, rgba(95, 142, 176, 0.4) 66%, rgba(116, 157, 176, 0.4) 100%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
          `,
          backgroundBlendMode: "overlay, overlay, normal, screen",
          animation: "crystal-shimmer 15s ease-in-out infinite",
        }}
      />

      <div className="container pt-8 mx-auto relative z-10 px-4 sm:px-0">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />

          <AddTask onTaskAdded={refreshTasks} />

          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />

          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            onDataChange={refreshTasks}
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPage={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
