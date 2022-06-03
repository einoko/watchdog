import React from "react";
import { Link } from "react-router-dom";
import { ScreenshotTimelineItem } from "./screenshotTimelineItem";

export const LatestScreenshot = ({ job }) => {
  return (
    <div>
      {job.states !== undefined && job.states.length > 0 && (
        <div>
          <h2 className=" pt-6 text-2xl font-bold">
            {job.states.length === 1 ? "Latest screenshot" : "Latest change"}
          </h2>
          <span className="font-normal  text-lg text-gray-500">
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
          {job.states.length === 1 ? (
            <div>
              <div>
                <Link
                  to={`/api/image/${job.states[job.states.length - 1].image}`}
                >
                  <img
                    className="mx-auto  pt-4"
                    alt={"Latest screenshot"}
                    src={`/api/image/${
                      job.states[job.states.length - 1].image
                    }`}
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="">
              <ScreenshotTimelineItem
                previousItem={job.states[job.states.length - 2]}
                item={job.states[job.states.length - 1]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
