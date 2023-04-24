import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import Filter from "./filter";
import { JsonRequest } from "../../utils/fetchUtil";
import { warningToast } from "../../utils/customToasts";
import MoonLoader from "react-spinners/MoonLoader";
import { JobListItem } from "./joblistitem";

export const JobsView = ({ location }) => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    JsonRequest("GET", "/api/jobs").then((json) => {
      setLoading(false);
      if (!json.errors) {
        setJobs(json.jobs);
      } else {
        warningToast("Error", "Could not fetch jobs.");
      }
    });
  }, []);

  const jobCounts = [
    {
      type: "All",
      count: jobs.length,
      current: filter === "All",
    },
    {
      type: "Visual",
      count: jobs.filter((job) => job.jobType === "visual").length,
      current: filter === "Visual",
    },
    {
      type: "Text",
      count: jobs.filter((job) => job.jobType === "text").length,
      current: filter === "Text",
    },
  ];

  const filteredJobs = jobs
    .filter((job) => {
      if (filter === "All") return true;
      return job.jobType.toLowerCase().includes(filter.toLowerCase());
    })
    .sort((a, b) => {
      return new Date(b.updatedAt) > new Date(a.updatedAt);
    });

  return (
    <Layout location={location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <h1 className="md:pl-6 text-3xl font-bold">Jobs</h1>
            <Filter jobCounts={jobCounts} setFilter={setFilter} />
            {loading ? (
              <div className="pt-8 text-center">
                <div className="flex justify-center">
                  <MoonLoader color="#000000" speedMultiplier={0.5} />
                </div>
                <p className="pt-4">Loading jobs.</p>
              </div>
            ) : (
              <>
                {jobs.length === 0 && (
                  <div className="pt-8 text-center text-xl">
                    There are no scheduled jobs running. Go add some!
                  </div>
                )}
                <ul className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <JobListItem key={job._id} job={job} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
