import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import { emailQueue } from './email_queue';
import { documentQueue } from './document_queue';
import { reportQueue } from './report_queue';

// Create Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(documentQueue),
    new BullAdapter(reportQueue),
  ],
  serverAdapter,
});

// Create monitoring express app
const app = express();

// Secure the monitoring dashboard
app.use('/admin/queues', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === `Basic ${process.env.QUEUE_MONITOR_AUTH}`) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.use('/admin/queues', serverAdapter.getRouter());

// Export queues
export {
  emailQueue,
  documentQueue,
  reportQueue,
};

// Start the monitoring server
const port = process.env.QUEUE_MONITOR_PORT || 3001;
app.listen(port, () => {
  console.log(`Queue monitor is running on port ${port}`);
});
