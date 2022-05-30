import {
  EyeIcon,
  BellIcon,
  ClockIcon,
  LinkIcon,
  ScissorsIcon,
  HashtagIcon,
  EyeOffIcon,
} from "@heroicons/react/outline";
import React from "react";
import { getJWT } from "../../utils/loginUtil";

export const JobInfo = ({ job }) => {
  const toggleActivity = async () => {
    await fetch(`/api/job/${job._id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active: !job.active,
      }),
    }).then((res) => {
      window.location.reload();
    });
  };

  const deleteJob = async () => {
    await fetch(`/api/job/${job._id}`, {
      method: "DELETE",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      window.location.href = "/jobs";
    });
  };

  return (
    <>
      <h1 className="lg:pl-6 text-4xl font-extrabold pb-2">{job.name}</h1>
      <div className="py-3">
        <span
          className={`${
            job.active
              ? "bg-green-300 text-green-800"
              : "text-red-800 bg-red-400"
          } lg:ml-4 py-2 px-3 font-semibold text-sm rounded-full`}
        >
          {job.active ? "Active" : "Paused"}
        </span>
      </div>
      {job.jobType !== undefined && (
        <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
          <EyeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          {job.jobType[0].toUpperCase() + job.jobType.slice(1)} comparison
        </div>
      )}
      <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
        <LinkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <a
          className="hover:underline font-semibold hover:text-gray-800"
          href={job.url}
        >
          {job.url}
        </a>
      </div>
      <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
        <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <p>
          Checking every {job.interval} (last check{" "}
          {new Date(job.updatedAt).toLocaleDateString("en-gb", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          )
        </p>
      </div>
      {job.states !== undefined && (
        <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
          <BellIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Detected {job.states.length - 1}{" "}
            {job.states.length === 2 ? "change" : "changes"} so far. (Threshold
            set to {Math.round(job.threshold * 100)}%)
          </p>
        </div>
      )}
      {job.visual_crop && (
        <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
          <ScissorsIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Crop enabled</p>
        </div>
      )}
      {job.visual_scrollToElement && (
        <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
          <HashtagIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Scroll to {job.visual_scrollToElement}</p>
        </div>
      )}
      {job.visual_hideElements && job.visual_hideElements.length > 0 && (
        <div className="flex flex-row lg:px-6 mt-3 text-gray-500">
          <EyeOffIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{job.visual_hideElements.join(", ")}</p>
        </div>
      )}
      <div className="lg:px-6 pt-8 flex flex-row">
        <button
          onClick={() => toggleActivity()}
          className="bg-indigo-500 hover:bg-indigo-700 text-sm font-semibold text-white p-3 rounded-md mr-3"
        >
          {job.active ? "Pause" : "Resume"} job
        </button>
        <button
          onClick={() => deleteJob()}
          className="bg-red-600 hover:bg-red-700 text-sm font-semibold text-white p-3 rounded-md"
        >
          Delete job
        </button>
      </div>
    </>
  );
};
