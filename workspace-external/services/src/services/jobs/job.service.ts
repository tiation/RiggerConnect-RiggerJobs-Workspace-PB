import { Job, JobSchema } from '@riggerhireapp/shared';
import { prisma } from '../../lib/prisma';
import { NotFoundError, ValidationError } from '../../lib/errors';
import { z } from 'zod';

const CreateJobDTO = JobSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export class JobService {
  public async createJob(data: z.infer<typeof CreateJobDTO>): Promise<Job> {
    const validatedData = CreateJobDTO.parse(data);

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        status: 'OPEN',
      },
    });

    return JobSchema.parse(job);
  }

  public async updateJob(
    jobId: string,
    data: Partial<z.infer<typeof CreateJobDTO>>
  ): Promise<Job> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Validate partial update data
    const validatedData = CreateJobDTO.partial().parse(data);

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: validatedData,
    });

    return JobSchema.parse(updatedJob);
  }

  public async getJob(jobId: string): Promise<Job> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return JobSchema.parse(job);
  }

  public async listJobs(params: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    employerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: Job[]; total: number }> {
    const { status, employerId, page = 1, limit = 10 } = params;

    const where = {
      ...(status && { status }),
      ...(employerId && { employerId }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    return {
      jobs: jobs.map(job => JobSchema.parse(job)),
      total,
    };
  }

  public async deleteJob(jobId: string): Promise<void> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.status === 'IN_PROGRESS') {
      throw new ValidationError('Cannot delete a job that is in progress');
    }

    await prisma.job.delete({ where: { id: jobId } });
  }

  public async updateJobStatus(
    jobId: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
  ): Promise<Job> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Validate status transition
    if (job.status === 'COMPLETED' && status !== 'COMPLETED') {
      throw new ValidationError('Cannot change status of a completed job');
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });

    return JobSchema.parse(updatedJob);
  }
}
