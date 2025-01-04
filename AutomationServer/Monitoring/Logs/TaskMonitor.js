const logs = [];

function logTask(taskId, status, timestamp = new Date()) {
logs.push({ taskId, status, timestamp });
console.log(`Task ${taskId} updated to status: ${status}`);
}

function getLogs() {
return logs;
}

module.exports = {
logTask,
getLogs,
};

