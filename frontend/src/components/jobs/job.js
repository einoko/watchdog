import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { useParams } from "react-router-dom";
import { getJWT } from "../../utils/loginUtil";
import { Timeline } from "./timeline";

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
      <div className="max-w-5xl mx-auto">
        <h1 className="font-extrabold text-5xl">{job.name}</h1>
        <p className="font-semibold py-3">
          {!job.active ? (
            <span className="bg-green-300 py-1 px-2 rounded-full text-green-900">
              Active
            </span>
          ) : (
            <span className="bg-red-300 py-1 px-2 rounded-full text-red-800">
              Paused
            </span>
          )}
        </p>
        {job.states !== undefined && (
          <Timeline states={job.states} />
        )}
      </div>
    </Layout>
  );
};
