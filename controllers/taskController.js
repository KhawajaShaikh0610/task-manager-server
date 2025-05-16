const Task = require("../models/Task");
const { taskSchema } = require("../validator/taskValidation");

exports.createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: "Task created successfully", data: task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be positive integers",
      });
    }

    const totalTasks = await Task.countDocuments({ userId });
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: tasks.length ? "Tasks fetched successfully" : "No tasks found",
      data: tasks,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// exports.getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.params.userId });

//     if (tasks.length === 0) {
//       return res
//         .status(200)
//         .json({ message: "No tasks found for this user", data: [] });
//     }

//     res
//       .status(200)
//       .json({ message: "Tasks fetched successfully", data: tasks });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: err.message });
//   }
// };

exports.updateTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", data: task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
