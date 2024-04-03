import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addProject = asyncHandler(async (req, res) => {
    const { title, description, members = [], dueDate } = req.body;
    // return console.log(title, description, members, dueDate);

    if (!title?.trim() || !description || !members?.length) throw new ApiError(400, "Required fields are missing!");

    const newProject = await Project.create({
        title: title.trim(),
        description: description.toLowerCase(),
        members,
        dueDate: dueDate || "",
        // user: req.user?._id
    });

    if (!newProject) throw new ApiError(500, "Error occurred while creating a task!");

    res.status(201).json(
        new ApiResponse(201, "New project created successfully!", { project: newProject })
    );

});

const editTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, priority, checklists = [], dueDate } = req.body;

    if (!title.trim() || !priority || !checklists?.length) throw new ApiError(400, "Required fields are missing!");

    const updatedTask = await Task.findByIdAndUpdate(taskId, {
        $set: {
            title: title.trim(),
            priority: priority.toLowerCase(),
            checklists,
            dueDate: dueDate || "",
        }
    }, {
        new: true
    });

    if (!updatedTask) throw new ApiError(500, "Error occurred while updating a task!");

    res.status(201).json(
        new ApiResponse(201, "Task updated successfully!", { task: updatedTask })
    );

});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) throw new ApiError(500, "Error occurred while deleting the task!");

    res.status(204).json(
        new ApiResponse(204, "", {})
    );
});

const getTasksByDuration = asyncHandler(async (req, res) => {

    const { duration } = req.query;

    let startDate = new Date();
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (duration === "Today") startDate.setHours(0, 0, 0, 0); // Start of the day
    else if (duration === "Week") startDate.setDate(startDate.getDate() - 6); // Start of the week
    else if (duration === "Month") startDate.setDate(startDate.getDate() - 29); // Start of the month

    //console.log(startDate, endDate);

    const tasksByState = {
        "backlog": [],
        "to-do": [],
        "progress": [],
        "done": []

    };
    const allTasks = await Task.find(
        {
            user: req.user?._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }
    );

    allTasks.forEach((task) => tasksByState[task.state]?.push(task));

    res.status(200).json(
        new ApiResponse(200, "Tasks fetched successfully!", { tasks: tasksByState })
    );
});

const getSingleTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("user", "name -_id");

    if (!task) throw new ApiError(404, "Task does not exists!");

    res.status(200).json(
        new ApiResponse(200, "Task fetched successfully!", { task })
    );

});

const updateTaskState = asyncHandler(async (req, res) => {
    const { state } = req.body;
    const { taskId } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(taskId,
        {
            $set: {
                state
            }
        }
    );

    if (!updatedTask) throw new ApiError(500, "Error occurred while updating state!");

    res.status(204).json(
        new ApiResponse(204, "", {})
    );
});




export {
    addProject,
    editTask,
    deleteTask,
    getTasksByDuration,
    getSingleTask,
    updateTaskState,
};