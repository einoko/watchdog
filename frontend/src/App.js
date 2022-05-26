import React, { useState } from "react";
import "./App.css";
import { Layout } from "./components/layout/layout";
import { useForm } from "react-hook-form";
import ReactCrop from "react-image-crop";
import { getJWT } from "./utils/loginUtil";
import { Disclosure } from "@headlessui/react";

import "react-image-crop/dist/ReactCrop.css";
import { ChevronRightIcon } from "@heroicons/react/solid";

export default function App({ location }) {
  const { register, handleSubmit } = useForm();
  const [imageFetched, setImageFetched] = useState(false);
  const [fetchingImage, setFetchingImage] = useState(false);
  const [error, setError] = useState("");
  const [crop, setCrop] = useState();
  const [imageData, setImageData] = useState(null);
  const [url, setUrl] = useState("");

  const handleScreenshot = async () => {
    setFetchingImage(true);
    setImageFetched(false);
    const response = await fetch("/api/preview", {
      method: "POST",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    });
    const json = await response.json();
    setFetchingImage(false);
    setImageFetched(true);
    if (json.error) {
      setError(json.error);
    }
    if (json.imageData) {
      setImageData(json.imageData);
    }
  };

  const onSubmit = (data) => {
    data.crop = crop;

    console.log(data);
  };

  return (
    <Layout location={location}>
      <div className="App bg-gray-200">
        <div className="mx-auto max-w-7xl xl:pt-8 xl:pb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="xl:rounded-lg bg-white shadow-lg sm:overflow-hidden">
              <div className="px-8 py-8">
                <div className="aspect-[4/3]">
                  <div className="min-h-full min-w-full border border-gray-300 rounded-lg shadow-inner overflow-hidden w-full h-full">
                    <div className="text-center flex min-h-full">
                      {!imageFetched ? (
                        <div className="m-auto">
                          {fetchingImage ? (
                            <h3 className="text-xl text-gray-600">
                              Fetching a screenshot. Please wait...
                            </h3>
                          ) : (
                            <div>
                              {error === "" ? (
                                <h3 className="text-xl text-gray-600">
                                  Enter a URL and click ‘Fetch’.
                                </h3>
                              ) : (
                                <div>
                                  <div className="text-xl text-red-500 text-center">
                                    {error}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <ReactCrop crop={crop} onChange={(c, p) => setCrop(p)}>
                          <img
                            src={`data:image/png;base64,${imageData}`}
                            alt="Screenshot of a website"
                          />
                        </ReactCrop>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-5 text-left space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                    >
                      Job name
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        {...register("name")}
                        className="flex-1 block sm:max-w-md w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                        placeholder="Enter a name for the job"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                    >
                      URL
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="sm:max-w-md w-full flex flex-col sm:flex-row rounded-md shadow-sm">
                        <input
                          type="text"
                          name="url"
                          id="url"
                          required={true}
                          {...register("url")}
                          onChange={(e) => {
                            setUrl(e.target.value);
                          }}
                          autoComplete="url"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                          placeholder="Enter a URL"
                        />
                        <button
                          type="button"
                          onClick={handleScreenshot}
                          className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Fetch
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="frequency"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                    >
                      Frequency
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <select
                          id="interval"
                          name="interval"
                          defaultValue={"day"}
                          className="sm:max-w-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          {...register("interval")}
                        >
                          <option value="1 minute">Every minute</option>
                          <option value="5 minutes">Every 5 minutes</option>
                          <option value="15 minutes">Every 15 minutes</option>
                          <option value="30 minutes">Every 30 minutes</option>
                          <option value="hour">Every hour</option>
                          <option value="3 hours">Every 3 hours</option>
                          <option value="6 hours">Every 6 hours</option>
                          <option value="12 hours">Every 12 hours</option>
                          <option value="day">Every day</option>
                          <option value="week">Every week</option>
                          <option value="month">Every month</option>
                          <option value="year">Every year</option>
                        </select>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        How often should the page be checked for changes?
                      </p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="frequency"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                    >
                      Trigger
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <select
                          id="threshold"
                          name="threshold"
                          className="sm:max-w-md w-full block focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          {...register("threshold")}
                        >
                          <option value="0.00">Any change</option>
                          <option value="0.01">Tiny (1%)</option>
                          <option value="0.10">Medium (10%)</option>
                          <option value="0.25">Major (25%)</option>
                          <option value="0.50">Gigantic (50%)</option>
                        </select>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        How big of a change should trigger the alert?
                      </p>
                    </div>
                  </div>

                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="py-2">
                          <div className="relative">
                            <div
                              className="absolute inset-0 flex items-center"
                              aria-hidden="true"
                            >
                              <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative pt-6 flex justify-center">
                              <div className="px-3 pl-0 lg:pl-48 flex flex-row items-center bg-white text-lg font-medium text-gray-900">
                                <div>Advanced settings</div>
                                <div className="h-5 w-5 ml-1">
                                  <ChevronRightIcon
                                    className={`${
                                      open ? "transform rotate-90" : ""
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div className="pb-4 lg:pl-48 lg:w-[860px]">
                            <p className="mt-2 text-sm text-gray-500">
                              The following settings are optional. You can use
                              them to improve the quality of the website
                              capture. You can use the "Fetch" button to test
                              the settings.
                            </p>
                          </div>

                          <div className="space-y-8">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                              <label
                                htmlFor="scrollToElement"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                              >
                                Scroll to element
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                  type="text"
                                  name="scrollToElement"
                                  id="scrollToElement"
                                  {...register("scrollToElement")}
                                  className="flex-1 block sm:max-w-md w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                  placeholder=".content"
                                />
                                <p className="mt-2 text-sm text-gray-500 max-w-lg">
                                  Scrolls to the DOM element that matches the
                                  given CSS selector.
                                </p>
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-startsm:pt-5">
                              <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                              >
                                Hide elements
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                  type="text"
                                  name="hideElements"
                                  id="hideElements"
                                  {...register("hideElements")}
                                  className="flex-1 block sm:max-w-md w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                  placeholder=".cookieBanner, #ad_overlay"
                                />
                                <p className="mt-2 text-sm text-gray-500 max-w-lg">
                                  Hide DOM elements that match given CSS
                                  selectors. Separate multiple selectors with a
                                  comma.
                                </p>
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-startsm:pt-5">
                              <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-48"
                              >
                                Cookies
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                  type="text"
                                  name="cookies"
                                  id="cookies"
                                  {...register("cookies")}
                                  className="flex-1 block sm:max-w-md w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                  placeholder="id=a3fWa; Expires=Thu, 31 Oct 2021 07:28:00 GMT;"
                                />
                                <p className="mt-2 text-sm text-gray-500 max-w-lg">
                                  Include cookies that will be injected during
                                  capturing. Enter cookies as one string. Tip:
                                  Running <pre className="inline">document.cookie</pre> on any site
                                  will return all cookies that are currently
                                  accessible from that location.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>

              <div className="px-7 py-6 text-left sm:px-6 text-right border-t">
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Start monitoring
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
