const AutomationTaskHandler = require('../../Services/AutomationTaskHandler');
const taskQueue = require('../../Services/TaskQueueService'); // Mock or actual queue service

const taskHandler = new AutomationTaskHandler(taskQueue);

module.exports = {
async processTask(req, res) {
    const { type, payload } = req.body;

    try {
    const task = { id: generateTaskId(), type, payload };
    console.log(`Received task: ${task.id}`);
    await taskHandler.processTask(task);
    res.status(200).json({ message: `Task ${task.id} processed successfully.` });
    } catch (error) {
    console.error('Error processing task:', error);
    res.status(500).json({ message: 'Task processing failed.', error: error.message });
    }
},
};

function generateTaskId() {
return `task_${Date.now()}`;
}

