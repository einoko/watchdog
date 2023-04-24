import React from "react";
import ReactCrop from "react-image-crop";
import { MoonLoader } from "react-spinners";

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
                <div>
                  <div className="flex justify-center">
                    <MoonLoader color="#000000" speedMultiplier={0.5} />
                  </div>
                  <p className="pt-4">Fetching. Please wait.</p>
                </div>
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
                <img src={imageData} alt="Screenshot of a website" />
              </ReactCrop>
            </div>
          ) : (
            <div className="min-w-full min-h-full flex flex-col items-center">
              <div className="text-black text-center sm:text-lg font-mono p-4">
                {textData}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
