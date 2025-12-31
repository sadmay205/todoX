import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
    try {
        const { filter = 'today' } = req.query;

        let startDay;
        const now = new Date();

        now.setHours(0, 0, 0, 0);

        switch (filter.trim()) {
            case 'today':
                startDay = new Date(now);
                break;

            case 'week':
                const day = now.getDay();
                const diff = now.getDate() - (day === 0 ? 6 : day - 1);
                startDay = new Date(now.setDate(diff));
                break;

            case 'month':
                startDay = new Date(now.getFullYear(), now.getMonth(), 1);
                break;

            case 'all':
            default:
                startDay = null;
        }

        const query = startDay ? { createdAt: { $gte: startDay } } : {};

        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: 'active' } }, { $count: 'count' }],
                    completedCount: [{ $match: { status: 'completed' } }, { $count: 'count' }]
                }
            }
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completedCount = result[0].completedCount[0]?.count || 0;

        res.status(200).json({ tasks, activeCount, completedCount });
    } catch (err) {
        console.error("Error getting tasks", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;

        let updateData = { title, status, completedAt };
        if (status === 'completed' && !completedAt) {
            updateData.completedAt = new Date();
        }
        if (status === 'active') {
            updateData.completedAt = null;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedTask)
            return res.status(404).json({ message: "Task not found" });

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("Error updating task", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);
        if (!deleteTask)
            return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task", err);
        res.status(500).json({ message: "Internal server error" });
    }
};