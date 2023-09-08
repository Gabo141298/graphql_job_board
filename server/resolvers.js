import { createJob, deleteJob, getJob, getJobTotalCount, getJobs, getJobsByCompanyId, updateJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await getJobTotalCount();

      return { items, totalCount };
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`No Job found with id ${id}`);
      }

      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError(`No Company found with id ${id}`);
      }

      return company;
    },
  },
  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
  },
  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return createJob({ title, description, companyId: user.companyId });
    },
    deleteJob: (_root, { input: { id } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return deleteJob(id, user.companyId);
    },
    updateJob: (_root, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return updateJob({ id, title, description }, user.companyId);
    },
  },
};

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { error: "NOT_FOUND" }
  });
}

const unauthorizedError = (message) => {
  return new GraphQLError(message, {
    extensions: { error: "UNAUTHORIZED" }
  });
}

const toIsoDate = (value) => {
  return value.split('T')[0];
}