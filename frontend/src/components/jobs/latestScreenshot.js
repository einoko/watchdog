import React from "react";

export const LatestScreenshot = ({ job }) => {
  return (
    <div>
      {job.states !== undefined && job.states.length > 0 && (
        <div>
          <h2 className="lg:pl-6 pt-6 text-2xl font-bold">
            {job.states.length === 1 ? "Latest screenshot" : "Latest changes"}
          </h2>
          <span className="font-normal lg:pl-6 text-lg text-gray-500">
            {new Date(
              job.states[job.states.length - 1].createdAt
            ).toLocaleDateString("en-gb", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
          <div>
            <a href={`/api/image/${job.states[job.states.length - 1].image}`}>
              <img
                className="mx-auto lg:pl-6 pt-4"
                alt={"Latest screenshot"}
                src={`/api/image/${job.states[job.states.length - 1].image}`}
              />
            </a>
          </div>
          {job.states.length >= 2 && (
            <div>
              <h3 className="lg:pl-6 pt-6 text-2xl font-semibold">Before</h3>
              <span className="font-normal lg:pl-6 text-lg text-gray-500">
                {new Date(
                  job.states[job.states.length - 2].createdAt
                ).toLocaleDateString("en-gb", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              <div>
                <a
                  href={`/api/image/${job.states[job.states.length - 2].image}`}
                >
                  <img
                    className="mx-auto lg:pl-6 pt-4"
                    alt={"Latest screenshot"}
                    src={`/api/image/${
                      job.states[job.states.length - 2].image
                    }`}
                  />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
