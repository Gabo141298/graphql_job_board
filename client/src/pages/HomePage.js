import { useState } from 'react';
import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useJobs } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 20;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, totalCount, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);

  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      {/* <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
