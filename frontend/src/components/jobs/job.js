import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { useParams } from "react-router-dom";

export const JobView = ({ location }) => {
  const [job, setJob] = useState({});

  const params = useParams();
  return (
    <Layout location={location}>
      <div>
        <h1>Job {params.jobID} here</h1>
      </div>
    </Layout>
  );
};
