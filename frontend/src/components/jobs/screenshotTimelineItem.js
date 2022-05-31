import React from "react";

export const ScreenshotTimelineItem = ({ item }) => {
  return (
    <div className="pt-4">
      <p>Screenshot</p>
      <a href={`/api/image/${item.image}`}>
        <img src={`/api/image/${item.image}`} alt={"Screenshot"} />
      </a>
      {item.diff && (
        <div>
          <p className="pt-4">Difference</p>
          <img src={`/api/image/${item.diff}`} alt={"Diff Screenshot"} />
        </div>
      )}
    </div>
  );
};
