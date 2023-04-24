import React, { useState, useEffect } from "react";
import { JsonRequest } from "../../utils/fetchUtil";

export const Statistics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    JsonRequest("GET", `/api/admin/statistics`).then((json) => {
      setData(json);
    });
  }, []);

  return (
    <div className="pb-0 lg:px-8 lg:pb-12">
      <h1 className="text-2xl font-bold pb-4">Statistics</h1>
      <div>
        <div className="py-5 flex flex-wrap flex-row lg:flex-col bg-white space-y-0 lg:space-y-5  overflow-hidden pl-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate mr-6">
              Registered users
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.userCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate mr-6">
              Total number of jobs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.jobCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate mr-6">
              Visual jobs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.visualJobCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate mr-6">
              Text jobs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {data.textJobCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate mr-6">
              Files on server
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {(data.imageFolderSize / 1000000).toFixed(1)} MB
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

/*

      userCount,
      jobCount,
      visualJobCount,
      textJobCount,
      imageFolderSize,



*/
