import React from "react";
import { BellIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/outline";
import { Disclosure } from "@headlessui/react";
import { ScreenshotTimelineItem } from "./screenshotTimelineItem";
import { KeywordTimelineItem } from "./keywordTimelineItem";
import { TextDiffTimelineItem } from "./textDiffTimelineItem";

export const Timeline = ({ job }) => {
  const states = job.states;

  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-start-3 lg:col-span-1"
    >
      <div className="bg-white py-5 sm:px-6">
        <h2
          id="timeline-title"
          className="text-2xl font-semibold text-gray-900"
        >
          Timeline
        </h2>

        <div className="mt-6 flow-root">
          <div>
            <ul role="list" className="-mb-8">
              {states.map((item, itemIdx) => (
                <li key={item.createdAt}>
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
                            <BellIcon
                              className="w-5 h-5 text-white"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 flex-col justify-between space-x-4">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="w-full">
                                <div className="flex sm:flex-row flex-col sm:justify-between">
                                  <div className="text-left flex flex-row justify-start items-center">
                                    <p className="text-lg font-semibold text-gray-800">
                                      {itemIdx === 0 ? (
                                        <span>
                                          <span>Job created</span>
                                        </span>
                                      ) : (
                                        <span>
                                          <span>
                                            {job.text_type === "added" ||
                                            job.text_type === "removed"
                                              ? "Keyword alert"
                                              : "Difference detected"}
                                          </span>
                                        </span>
                                      )}
                                    </p>
                                    <ChevronRightIcon
                                      className={`${
                                        open ? "transform rotate-90" : ""
                                      } h-5 w-5 ml-2 pt-1 mr-2`}
                                    />
                                  </div>
                                  <div className="text-left sm:text-right text whitespace-nowrap pt-[3px] text-gray-500">
                                    <time dateTime={item.createdAt}>
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleDateString("en-gb", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                      })}
                                    </time>
                                  </div>
                                </div>
                              </Disclosure.Button>
                              <Disclosure.Panel className="text-gray-700">
                                {job.jobType === "visual" ? (
                                  <ScreenshotTimelineItem item={item} />
                                ) : job.text_type === "any_change" ? (
                                  <div>
                                    <TextDiffTimelineItem
                                      previousItem={
                                        itemIdx > 0 ? states[itemIdx - 1] : null
                                      }
                                      item={item}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <KeywordTimelineItem
                                      job={job}
                                      item={item}
                                    />
                                  </div>
                                )}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
