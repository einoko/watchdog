import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { getJWT } from "../../utils/loginUtil.js";
import { ClockIcon, LinkIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import Filter from "./filter";

export const JobsView = ({ location }) => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/jobs", {
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs);
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
            {jobs.length === 0 && (
              <div className="pt-8 text-center text-xl">
                There are no scheduled jobs running. Go add some!
              </div>
            )}
            <ul className="divide-y divide-gray-200">
              {filteredJobs.map((jobListing) => (
                <li key={jobListing._id}>
                  <div className="block">
                    <div className="md:px-6 py-4 sm:px-2">
                      <div className="flex items-center justify-between">
                        <p className="text-2xl flex flex-wrap items-center font-bold text-gray-700 truncate">
                          <Link
                            className="pr-3"
                            to={{
                              pathname: `/jobs/${jobListing._id}`,
                            }}
                          >
                            {jobListing.name}{" "}
                          </Link>
                          <span
                            className={`${
                              jobListing.active
                                ? "bg-green-300 text-green-800"
                                : "text-gray-900 bg-gray-300"
                            } text-xs py-1 px-2 font-semibold rounded-full`}
                          >
                            {jobListing.active ? "Active" : "Paused"}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex flex-col gap-y-2">
                          <Link
                            to={jobListing.url}
                            className="flex items-center text-sm text-gray-500"
                          >
                            <LinkIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-1">
                              {jobListing.url}
                            </span>
                          </Link>
                          <p className="flex items-center my-2 sm:mt-0 text-sm text-gray-500">
                            <ClockIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            Checking every {jobListing.interval}
                          </p>
                        </div>
                        <div>
                          <div className="flex py-1 items text-sm text-gray-500 sm:mt-0">
                            <p>
                              Detected{" "}
                              {Math.max(jobListing.states.length - 1, 0)}{" "}
                              {jobListing.states.length === 2
                                ? "change"
                                : "changes"}{" "}
                              so far{" "}
                            </p>
                          </div>
                          <div className="flex items text-sm text-gray-500 sm:mt-0">
                            <p>
                              Last change:{" "}
                              {new Date(
                                jobListing.updatedAt
                              ).toLocaleDateString("en-gb", {
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};
