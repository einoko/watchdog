import { ClockIcon, LinkIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";

export const JobListItem = ({ job }) => {
  console.log(job);
  return (
    <li key={job._id}>
      <div className="block">
        <div className="md:px-6 py-4 sm:px-2">
          <div className="flex items-center justify-between">
            <p className="text-2xl flex flex-wrap items-center font-bold text-gray-700 truncate">
              <Link
                className="pr-3"
                to={{
                  pathname: `/jobs/${job._id}`,
                }}
              >
                {job.name}{" "}
              </Link>
              {window.location.pathname.includes("/admin") && (
                <span className="text-xs py-1 px-2 mr-2 font-semibold rounded-full border border-gray-700">
                  {job.jobType[0].toUpperCase() + job.jobType.slice(1)}
                </span>
              )}

              <span
                className={`${
                  job.active
                    ? "bg-green-300 text-green-800"
                    : "text-gray-900 bg-gray-300"
                } text-xs py-1 px-2 font-semibold rounded-full`}
              >
                {job.active ? "Active" : "Paused"}
              </span>
            </p>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex flex-col gap-y-2 overflow-hidden">
              <a
                href={job.url}
                className="flex items-center text-sm text-gray-500 truncate"
              >
                <LinkIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="truncate" title={job.url}>
                  {job.url}
                </span>
              </a>
              <p className="flex items-center my-2 sm:mt-0 text-sm text-gray-500">
                <ClockIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Checking every {job.interval}
              </p>
            </div>
            <div className="shrink-0 sm:pl-2">
              <div className="flex py-1 items text-sm text-gray-500 sm:mt-0">
                <p>
                  Detected {Math.max(job.states.length - 1, 0)}{" "}
                  {job.states.length === 2 ? "change" : "changes"} so far{" "}
                </p>
              </div>
              <div className="flex items text-sm text-gray-500 sm:mt-0">
                <p>
                  Last change:{" "}
                  {new Date(job.updatedAt).toLocaleDateString("en-gb", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
