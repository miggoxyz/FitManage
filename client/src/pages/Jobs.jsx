import { useEffect, useState } from "react";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
        setLoading(false);
      } catch {
        setError("Failed to fetch jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">Job ID: {job.id}</h3>
            <p>Status: {job.status}</p>
            <p>Customer: {job.customer_name}</p>
            <p>Contact: {job.customer_contact}</p>
            <p>Address: {job.customer_address}</p>
            <p>Start Date: {job.start_date || "Not assigned"}</p>
            <p>End Date: {job.end_date || "Not assigned"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
