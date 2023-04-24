import React, { useState, useEffect } from "react";
import { Layout } from "../layout/layout";
import { JobsList } from "./jobsList";
import { UserCard } from "./userCard";
import { JsonRequest } from "../../utils/fetchUtil";

export const User = () => {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);

  const userId = window.location.pathname.split("/")[3];

  useEffect(() => {
    JsonRequest("GET", `/api/admin/user/${userId}`).then((json) => {
      setUser(json.user);
      setJobs(json.jobs);
    });
  }, [userId]);

  return (
    <Layout location={window.location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <main className="-mt-24 pb-8">
              <div className="max-w-3xl pt-24 mx-auto lg:max-w-7xl">
                <h1 className="sr-only">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-4 lg:gap-8">
                  <div className="sm:px-6 lg:px-0 grid grid-cols-1 gap-4 lg:col-span-1">
                    <section aria-labelledby="section-1-title">
                      <div className="bg-white overflow-hidden">
                        <div className="p-0">
                          <UserCard user={user} />
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="sm:px-8 grid grid-cols-1 col-span-3 gap-4">
                    {jobs.length > 0 ? (
                      <div>
                        <h1 className="text-2xl font-bold px-6">Jobs</h1>
                        <ul className="divide-y divide-gray-200">
                          <JobsList jobs={jobs} />
                        </ul>
                      </div>
                    ) : (
                      <div className="text-xl font-bold">
                        User has no jobs yet.
                      </div>
                    )}
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
