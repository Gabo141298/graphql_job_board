import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from './queries';
import { useMutation, useQuery } from '@apollo/client';

export const useCompany = (id) => {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id }
  });

  return { company: data?.company, loading, error: Boolean(error) };
};

export const useCreateJob = () => {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const { data: { job } } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      }
    });
    return job;
  };

  return { createJob, loading };
};

export const useJob = (id) => {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id }
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export const useJobs = (limit, offset) => {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
    variables: { limit, offset }
  });

  return {
    jobs: data?.jobs?.items,
    totalCount: data?.jobs?.totalCount,
    loading, error: Boolean(error)
  };
};