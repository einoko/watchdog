import React from "react";
import Diff from "text-diff";

export const LatestTextDiff = ({ job }) => {
  let html = "";

  if (job.states !== undefined && job.states.length > 1) {
    const diff = new Diff();
    let textDiff = diff.main(
      job.states[job.states.length - 2].text,
      job.states[job.states.length - 1].text
    );
    diff.cleanupSemantic(textDiff);
    html = diff.prettyHtml(textDiff);
  }

  return (
    <div>
      {job.states.length > 1 ? (
        <div>
          <h2 className="lg:pl-6 pt-6 text-2xl font-bold">
            {job.states.length === 1 ? "Latest screenshot" : "Latest change"}
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
          <div className="pt-8">
            <div
              className="lg:pl-6 prose text-gray-900"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="lg:pl-6 pt-8">
          <span className="text-xl font-semibold">No changes yet.</span>
        </div>
      )}
    </div>
  );
};
