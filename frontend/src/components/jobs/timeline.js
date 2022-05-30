import React from "react";
import { EyeIcon, PlusIcon } from "@heroicons/react/outline";

export const Timeline = ({ states }) => {
  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-start-3 lg:col-span-1"
    >
      <div className="bg-white px-4 py-5 sm:px-6">
        <h2
          id="timeline-title"
          className="text-2xl font-semibold text-gray-900"
        >
          Timeline
        </h2>

        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {states.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== states.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`${
                          itemIdx === 0 ? "bg-gray-500" : "bg-green-500"
                        } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                      >
                        {itemIdx === 0 ? (
                          <PlusIcon
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeIcon
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 flex justify-between space-x-4">
                      <div>
                        <p className="text-lg font-semibold mb-3 text-gray-800">
                          {itemIdx === 0
                            ? "Job created"
                            : "Difference was detected"}
                          {itemIdx !== 0 && (
                            <a
                              className="pl-1 underline text-blue-600"
                              target="_blank"
                              rel="noreferrer"
                              href={`http://localhost:3001/api/image/${item.diff}`}
                            >
                              (difference)
                            </a>
                          )}
                        </p>
                        <div>
                          <img
                            alt={"New state"}
                            src={`http://localhost:3001/api/image/${item.image}`}
                          />
                        </div>
                      </div>
                      <div className="text-right text whitespace-nowrap text-gray-500">
                        <time dateTime={item.createdAt}>
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-gb",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: "utc",
                            }
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
