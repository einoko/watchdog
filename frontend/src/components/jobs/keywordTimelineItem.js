import React from "react";

export const KeywordTimelineItem = ({ job, item }) => {
  return (
    <div className="prose pt-4 text-gray-900 -ml-8">
      {item.matches !== undefined && (
        <ul>
          {item.matches.map((match, index) => {
            return (
              <li key={index}>
                <p>
                  Keyword <b className="underline">{match}</b> was{" "}
                  {job.text_type === "added" ? "" : "not"} found in the text.
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
