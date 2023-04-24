import React from "react";
import {} from "react-router-dom";
import { JobListItem } from "../jobs/joblistitem";

export const JobsList = ({ jobs }) => {
  return (
    <div>
      <div className="mt-2 flex flex-col space-y-2 divide-y divide-gray-200">
        {jobs.map((job) => (
          <JobListItem job={job} />
        ))}
      </div>
    </div>
  );
};
