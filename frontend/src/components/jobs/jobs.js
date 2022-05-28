import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { getJWT } from "../../utils/loginUtil.js";
import { ClockIcon, EyeIcon, LinkIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

export const JobsView = ({ location }) => {
  const [visualJobs, setVisualJobs] = useState([]);
  const [textJobs, setTextJobs] = useState([]);
  useEffect(() => {
    fetch("/api/jobs/all", {
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVisualJobs(data.jobs.visual);
        setTextJobs(data.jobs.text);
      });
  }, []);

  return (
    <Layout location={location}>
      <div className="mx-auto max-w-7xl pt-8">
        <div className="min-h-screen bg-white sm:overflow-hidden p-8">
          <h1 className="pl-6 mb-5 text-2xl font-semibold">Scheduled jobs</h1>
          {visualJobs.length === 0 && (
            <div className="pt-8 text-center text-xl">
              There are no scheduled jobs running. Go add some!
            </div>
          )}
          <ul role="list" className="divide-y divide-gray-200">
            {visualJobs.map((jobListing) => (
              <li key={jobListing._id}>
                <div href="#" className="block hover:bg-gray-50 rounded-lg">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        <Link
                          to={{
                            pathname: `/jobs/${jobListing._id}`,
                          }}
                        >{jobListing.name}</Link>
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button className="text-red-500 underline">
                          Delete job
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex flex-col gap-y-2">
                        <p className="flex items-center text-sm text-gray-500">
                          <LinkIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {jobListing.url}
                        </p>
                        <p className="flex items-center text-sm text-gray-500">
                          <ClockIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Checking every {jobListing.interval}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <EyeIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          Detected {Math.max(jobListing.states.length - 1, 0)}{" "}
                          changes so far
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};
