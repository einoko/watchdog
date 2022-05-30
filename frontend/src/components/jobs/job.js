import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { useParams } from "react-router-dom";
import { getJWT } from "../../utils/loginUtil";
import { Timeline } from "./timeline";
import { LinkIcon, ClockIcon, EyeIcon } from "@heroicons/react/outline";

export const JobView = ({ location }) => {
  const [job, setJob] = useState({});

  useEffect(() => {
    fetch(`/api/job/${params.jobID}`, {
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.job);
        setJob(data.job);
      });
  }, []);

  const params = useParams();
  return (
    <Layout location={location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <h1 className="lg:pl-6 text-3xl font-bold">{job.name}</h1>
            <div className="flex flex-row lg:px-6 mt-3 text-gray-500 hover:text-gray-800">
              <LinkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <a className="hover:underline font-semibold" href={job.url}>
                {job.url}
              </a>
            </div>
            <div className="flex flex-row lg:px-6 mt-3 text-gray-500 hover:text-gray-800">
              <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>Checking every {job.interval}</p>
            </div>
            {job.states !== undefined && (
              <div>
                <div className="flex flex-row lg:px-6 mt-3 text-gray-500 hover:text-gray-800">
                  <EyeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>Detected {job.states.length - 1} changes so far.</p>
                </div>
                <Timeline states={job.states} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
