import { Tab } from "@headlessui/react";
import React from "react";
import { Link } from "react-router-dom";

export const ScreenshotTimelineItem = ({ previousItem, item }) => {
  return (
    <div className="pt-4">
      <Tab.Group defaultIndex={1}>
        <Tab.List>
          {previousItem !== null && (
            <Tab className="focus:outline-none">
              {({ selected }) => (
                <span
                  className={`${
                    selected
                      ? "underline text-gray-800 font-semibold"
                      : "text-gray-400 hover:underline"
                  } `}
                >
                  Previous
                </span>
              )}
            </Tab>
          )}
          <Tab className="focus:outline-none">
            {({ selected }) => (
              <span
                className={`${
                  selected
                    ? "underline text-gray-800 font-semibold ring-black"
                    : "text-gray-400 hover:underline"
                } px-5`}
              >
                Screenshot
              </span>
            )}
          </Tab>
          {item.diff && (
            <Tab className="focus:outline-none">
              {({ selected }) => (
                <span
                  className={`${
                    selected
                      ? "underline text-gray-800 font-semibold"
                      : "text-gray-400 hover:underline"
                  }`}
                >
                  Difference
                </span>
              )}
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels>
          {previousItem !== null && (
            <Tab.Panel>
              <div className="pt-4">
                <Link to={`/api/image/${previousItem.image}`}>
                  <img
                    src={`/api/image/${previousItem.image}`}
                    alt={"Screenshot"}
                  />
                </Link>
              </div>
            </Tab.Panel>
          )}
          <Tab.Panel>
            <div className="pt-4">
              <Link to={`/api/image/${item.image}`}>
                <img src={`/api/image/${item.image}`} alt={"Screenshot"} />
              </Link>
            </div>
          </Tab.Panel>
          {item.diff && (
            <Tab.Panel>
              <div className="pt-4">
                <Link to={`/api/image/${item.diff}`}>
                  <img src={`/api/image/${item.diff}`} alt={"Screenshot"} />
                </Link>
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
