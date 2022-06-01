import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { useParams } from "react-router-dom";
import { getJWT } from "../../utils/loginUtil";
import { Timeline } from "./timeline";
import { JobInfo } from "./jobInfo";
import { LatestScreenshot } from "./latestScreenshot";
import { LatestTextDiff } from "./latestTextDiff";
import { LatestKeywordAlert } from "./latestKeywordAlert";

export const JobView = ({ location }) => {
  const [job, setJob] = useState({});
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetch(`/api/job/${params.jobID}`, {
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJob(data.job);
        setActive(data.job.active);
      });
  }, []);

  const params = useParams();
  return (
    <Layout location={location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <main className="-mt-24 pb-8">
              <div className="max-w-3xl pt-24 mx-auto lg:max-w-7xl">
                <h1 className="sr-only">{job.name}</h1>
                <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-4 lg:gap-8">
                  <div className="sm:px-6 lg:px-0 grid grid-cols-1 gap-4 lg:col-span-2">
                    <section aria-labelledby="section-1-title">
                      <div className="bg-white overflow-hidden">
                        <div className="p-0">
                          <JobInfo
                            job={job}
                            active={active}
                            setActive={setActive}
                          />
                        </div>
                        {job.jobType === "visual" ? (
                          <LatestScreenshot job={job} />
                        ) : job.text_type === "any_change" ? (
                          <LatestTextDiff job={job} />
                        ) : (
                          <LatestKeywordAlert job={job} />
                        )}
                      </div>
                    </section>
                  </div>
                  <div className="grid grid-cols-1 col-span-2 gap-4">
                    <section aria-labelledby="section-2-title">
                      <div className="bg-white overflow-hidden">
                        <div className="px-0">
                          {job.states !== undefined &&
                            job.states.length >= 1 && <Timeline job={job} />}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};
