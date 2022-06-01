import React from "react";
import ReactCrop from "react-image-crop";

export const Screen = ({
  dataFetched,
  fetchingData,
  comparisonType,
  crop,
  setCrop,
  imageData,
  textData,
}) => {
  return (
    <div className="aspect-[4/3]">
      <div
        className={`${
          comparisonType === "text" ? "overflow-scroll" : "overflow-hidden"
        } min-h-full min-w-full border border-gray-300 rounded-lg shadow-inner w-full h-full`}
      >
        <div className="text-center flex min-h-full">
          {!dataFetched ? (
            <div className="m-auto">
              {fetchingData ? (
                <h3 className="text-xl text-gray-600">
                  Fetching URL. Please wait...
                </h3>
              ) : (
                <div>
                  <h3 className="text-xl text-gray-600">
                    Enter a URL and click ‘Fetch’.
                  </h3>
                </div>
              )}
            </div>
          ) : comparisonType === "visual" ? (
            <div>
              <ReactCrop crop={crop} onChange={(c, p) => setCrop(p)}>
                <img
                  src={`data:image/png;base64,${imageData}`}
                  alt="Screenshot of a website"
                />
              </ReactCrop>
            </div>
          ) : (
            <div className="min-w-full min-h-full flex flex-col items-center">
              <div className="mx-auto my-auto text-black text-center prose-xl">
                {textData}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
