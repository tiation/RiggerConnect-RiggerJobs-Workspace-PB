const taskMetrics = {
totalTasks: 0,
successfulTasks: 0,
failedTasks: 0,
};

function recordTaskSuccess() {
taskMetrics.totalTasks++;
taskMetrics.successfulTasks++;
}

function recordTaskFailure() {
taskMetrics.totalTasks++;
taskMetrics.failedTasks++;
}

function getMetrics() {
return taskMetrics;
}

module.exports = {
recordTaskSuccess,
recordTaskFailure,
getMetrics,
};

