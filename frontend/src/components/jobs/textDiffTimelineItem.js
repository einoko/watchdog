import React from "react";
import Diff from "text-diff";
import "../../style/diffStyle.css";

export const TextDiffTimelineItem = ({ previousItem, item }) => {
  let html = "";

  if (previousItem !== null) {
    const diff = new Diff();
    let textDiff = diff.main(previousItem.text, item.text);
    diff.cleanupSemantic(textDiff);
    html = diff.prettyHtml(textDiff);
  }

  return (
    <div className="pt-4">
      {previousItem !== null ? (
        <div className="prose text-gray-900" dangerouslySetInnerHTML={{ __html: html }}></div>
      ) : (
        <div>
          <p className="prose text-gray-900">{item.text}</p>
        </div>
      )}
    </div>
  );
};
