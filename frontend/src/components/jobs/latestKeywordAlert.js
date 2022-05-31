import React from "react";

export const LatestKeywordAlert = ({ job }) => {
  let lastState;

  if (job.states !== undefined && job.states.length > 1) {
    lastState = job.states[job.states.length - 1];
  }

  return (
    <div className="lg:pl-2">
      {lastState !== undefined && (
        <>
          <div>
            <h2 className="lg:pl-6 pt-12 text-2xl font-bold">
              Latest keyword alert
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
          </div>
          <div className="prose">
            <ul>
              {lastState.matches.map((match, index) => {
                return (
                  <li key={index}>
                    <p>
                      Keyword <b className="underline">{match}</b> was{" "}
                      {job.text_type === "added" ? "" : "not"} found in the
                      text.
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
