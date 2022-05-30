import React, { useState } from "react";
import "./App.css";
import { Layout } from "./components/layout/layout";
import { useForm } from "react-hook-form";
import ReactCrop from "react-image-crop";
import { getJWT } from "./utils/loginUtil";
import { Disclosure } from "@headlessui/react";

import "react-image-crop/dist/ReactCrop.css";
import { ChevronRightIcon } from "@heroicons/react/solid";

import { successToast, warningToast } from "./utils/customToasts";

export default function App({ location }) {
  const { register, handleSubmit } = useForm();
  const [dataFetched, setDataFetched] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState([]);
  const [crop, setCrop] = useState();
  const [imageData, setImageData] = useState(null);
  const [textData, setTextData] = useState(null);
  const [url, setUrl] = useState("");
  const [comparisonType, setComparisonType] = useState("visual");
  const [textCSS, setTextCSS] = useState("");
  const [scrollToElement, setScrollToElement] = useState();
  const [textComparisonMethod, setTextComparisonMethod] =
    useState("any_change");
  const [hideElements, setHideElements] = useState();

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const handlePreview = async () => {
    handleSubmit(async (data) => {
      if (comparisonType === "visual") {
        setErrors([]);
        setFetchingData(true);
        setDataFetched(false);
        const response = await fetch("/api/preview/image", {
          method: "POST",
          headers: {
            Authorization: getJWT(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            removeEmpty({
              url: data.url,
              scrollToElement: scrollToElement,
              hideElements: hideElements,
            })
          ),
        });
        const json = await response.json();
        setFetchingData(false);
        if (json.errors) {
          for (const error of json.errors) {
            setErrors([error]);
          }
        } else {
          setDataFetched(true);
        }
        if (json.imageData) {
          setImageData(json.imageData);
        }
      } else {
        setFetchingData(true);
        setDataFetched(false);
        const response = await fetch("/api/preview/text", {
          method: "POST",
          headers: {
            Authorization: getJWT(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            textCSS,
          }),
        });
        const json = await response.json();
        setFetchingData(false);
        if (json.errors) {
          json.errors.map((error) => {
            setErrors([error.param]);
          });
        } else {
          setDataFetched(true);
        }
        if (json.text) {
          setTextData(json.text);
        }
      }
    })();
  };

  const removeEmpty = (obj) => {
    Object.keys(obj).forEach(
      (k) => !obj[k] && obj[k] !== undefined && delete obj[k]
    );
    return obj;
  };

  const onSubmit = async (data) => {
    const response = await fetch("/api/job", {
      method: "POST",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        removeEmpty({
          name: data.name,
          jobType: comparisonType,
          url: data.url,
          interval: data.interval,
          threshold: data.threshold,
          visual_scrollToElement: data.visual_scrollToElement,
          visual_hideElements: data.visual_hideElements,
          visual_crop:
            crop === null || crop === undefined
              ? null
              : crop.width === 0 && crop.height === 0
              ? null
              : crop,
          text_css: data.text_css,
          text_type: data.text_type,
          text_words: data.text_words,
        })
      ),
    });
    const json = await response.json();
    if (json.errors) {
      for (const error of json.errors) {
        setErrors([error]);
      }
    } else {
      setDataFetched(false);
      successToast("Job added!", "Monitoring job successfully added.");
    }
  };

  return (
    <Layout location={location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <h1 className="lg:pl-8 text-3xl font-bold">New monitoring job</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white sm:overflow-hidden pt-8">
                <div className="px-8">
                  <div className="aspect-[4/3]">
                    <div
                      className={classNames(
                        comparisonType === "text"
                          ? "overflow-scroll"
                          : "overflow-hidden",
                        "min-h-full min-w-full border border-gray-300 rounded-lg shadow-inner w-full h-full"
                      )}
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
                            <ReactCrop
                              crop={crop}
                              onChange={(c, p) => setCrop(p)}
                            >
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

                  <div className="mt-6 sm:mt-5 text-left space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="frequency"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                      >
                        Comparison method
                      </label>
                      <div className="sm:col-span-2">
                        <div className="sm:col-span-2">
                          <div>
                            <fieldset className="mt-[10px]">
                              <legend className="sr-only">
                                Comparison method
                              </legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div key="visual" className="flex items-center">
                                  <input
                                    {...register("jobType")}
                                    id="visual_comparison"
                                    name="comparison"
                                    type="radio"
                                    value="visual"
                                    onChange={(e) => {
                                      setDataFetched(false);
                                      setFetchingData(false);
                                      setCrop(null);
                                      setComparisonType(e.target.value);
                                    }}
                                    defaultChecked={true}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                  />
                                  <label
                                    htmlFor="visual"
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    Visual
                                  </label>
                                </div>
                                <div key="text" className="flex items-center">
                                  <input
                                    {...register("comparison")}
                                    id="text_comparison"
                                    name="comparison"
                                    type="radio"
                                    value="text"
                                    onChange={(e) => {
                                      setDataFetched(false);
                                      setFetchingData(false);
                                      setCrop(null);
                                      setComparisonType(e.target.value);
                                    }}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                  />
                                  <label
                                    htmlFor="text"
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    Text
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                      >
                        Job name
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          {...register("name")}
                          className="flex-1 block sm:max-w-md w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                          placeholder="Enter a name for the job"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="username"
                        className="inline text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                      >
                        URL
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="sm:max-w-md w-full flex flex-col flex-reverse sm:flex-row rounded-md shadow-sm">
                          <input
                            type="text"
                            name="url"
                            id="url"
                            required
                            {...register("url")}
                            onChange={(e) => {
                              setUrl(e.target.value);
                            }}
                            autoComplete="url"
                            className={classNames(
                              errors.filter((e) => e.param === "url").length > 0
                                ? "border-red-500 border-2"
                                : "",
                              "flex-1 block w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                            )}
                            placeholder="Enter a URL"
                          />
                          <button
                            type="button"
                            onClick={handlePreview}
                            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Fetch
                          </button>
                        </div>
                        {errors.map((error, index) => {
                          if (error.param === "url") {
                            return (
                              <span
                                key={index}
                                className="absolute mt-1 font-semibold text-sm text-red-600"
                              >
                                {error.msg}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="frequency"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                      >
                        Frequency
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <select
                            id="interval"
                            name="interval"
                            defaultValue={"day"}
                            className="sm:max-w-md w-full  shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                    {comparisonType === "visual" && (
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="frequency"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                        >
                          Trigger
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <select
                              id="threshold"
                              name="threshold"
                              defaultValue={0.0}
                              className="sm:max-w-md w-full block  shadow-sm sm:text-sm border-gray-300 rounded-md"
                              {...register("threshold")}
                            >
                              <option value={0.0}>Any change</option>
                              <option value={0.01}>Tiny (1%)</option>
                              <option value={0.1}>Medium (10%)</option>
                              <option value={0.25}>Major (25%)</option>
                              <option value={0.5}>Gigantic (50%)</option>
                            </select>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            How big of a change should trigger the alert?
                          </p>
                        </div>
                      </div>
                    )}

                    {comparisonType === "text" && (
                      <div>
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                          >
                            Select element
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <div className="sm:max-w-md w-full flex flex-col sm:flex-row rounded-md shadow-sm">
                              <input
                                type="text"
                                name="url"
                                id="url"
                                {...register("text_css")}
                                onChange={(e) => {
                                  setTextCSS(e.target.value);
                                }}
                                autoComplete="url"
                                className="flex-1 block w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                                placeholder="#product-12305 > div > div.col-12.col-lg-10 > div > div.col-12.col-lg-7.summary.entry-summary"
                              />
                            </div>
                            <p className="mt-2 text-sm max-w-md text-gray-500">
                              Will only get the text of an element that matches
                              the given CSS selector. Also accepts CSS paths. If
                              no element is found, all text on the page will be
                              selected.
                            </p>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="frequency"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                          >
                            Method
                          </label>

                          <div className="sm:col-span-2">
                            <div className="sm:col-span-2">
                              <div>
                                {textComparisonMethod !== "any_change" && (
                                  <input
                                    type="text"
                                    name="keywords"
                                    id="name"
                                    required
                                    {...register("text_words")}
                                    className="flex-1 block sm:max-w-md w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                                    placeholder="in stock, available"
                                  />
                                )}

                                <fieldset className="mt-[11px]">
                                  <legend className="sr-only">
                                    Comparison method
                                  </legend>
                                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                    <div
                                      key="comparisonMethod"
                                      className="flex items-center"
                                    >
                                      <input
                                        {...register("text_type")}
                                        id="words_removed"
                                        name="wordChange"
                                        type="radio"
                                        defaultChecked={true}
                                        value="any_change"
                                        onChange={(e) =>
                                          setTextComparisonMethod(
                                            e.target.value
                                          )
                                        }
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      />
                                      <label
                                        htmlFor="text"
                                        className="ml-3 block text-sm font-medium text-gray-700"
                                      >
                                        Any change
                                      </label>
                                    </div>
                                    <div
                                      key="visual"
                                      className="flex items-center"
                                    >
                                      <input
                                        {...register("text_type")}
                                        id="words_added"
                                        name="wordChange"
                                        type="radio"
                                        value="added"
                                        onChange={(e) =>
                                          setTextComparisonMethod(
                                            e.target.value
                                          )
                                        }
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      />
                                      <label
                                        htmlFor="visual"
                                        className="ml-3 block text-sm font-medium text-gray-700"
                                      >
                                        Found
                                      </label>
                                    </div>
                                    <div
                                      key="text"
                                      className="flex items-center"
                                    >
                                      <input
                                        {...register("text_type")}
                                        id="words_removed"
                                        name="wordChange"
                                        type="radio"
                                        value="removed"
                                        onChange={(e) =>
                                          setTextComparisonMethod(
                                            e.target.value
                                          )
                                        }
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      />
                                      <label
                                        htmlFor="text"
                                        className="ml-3 block text-sm font-medium text-gray-700"
                                      >
                                        Not found
                                      </label>
                                    </div>
                                  </div>
                                </fieldset>

                                <ul className="mt-2 text-sm max-w-md text-gray-500">
                                  <li className="mb-1">
                                    When <b>Any change</b> is selected, a
                                    notification will be sent whenever a change
                                    in the selected text is detected.
                                  </li>
                                  <li>
                                    Alternatively, you can define keywords, and
                                    receive a notification whenever any of the
                                    words are either <b>Found</b> or{" "}
                                    <b>Not found</b> in the text. Separate
                                    multiple keywords with commas.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {comparisonType === "visual" && (
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
                                  <div className="px-3 pl-0 lg:pl-36 flex flex-row items-center bg-white text-lg font-medium text-gray-900">
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
                              <div className="pb-4 lg:pl-36 lg:w-[860px]">
                                <p className="mt-2 text-sm text-gray-500">
                                  The following settings are optional. You can
                                  use them to improve the quality of the website
                                  capture. You can use the "Fetch" button to
                                  test the settings.
                                </p>
                              </div>

                              <div className="space-y-8">
                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                  <label
                                    htmlFor="scrollToElement"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                                  >
                                    Scroll to element
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                      type="text"
                                      name="scrollToElement"
                                      id="scrollToElement"
                                      {...register("visual_scrollToElement")}
                                      onChange={(e) =>
                                        setScrollToElement(e.target.value)
                                      }
                                      className="flex-1 block sm:max-w-md w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                                      placeholder=".content"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 max-w-lg">
                                      Scrolls to the DOM element that matches
                                      the given CSS selector. If the element is
                                      not found, the page will not be scrolled.
                                    </p>
                                  </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-startsm:pt-5">
                                  <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 lg:pl-36"
                                  >
                                    Hide elements
                                  </label>
                                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                      type="text"
                                      name="hideElements"
                                      id="hideElements"
                                      {...register("visual_hideElements")}
                                      onChange={(e) =>
                                        setHideElements(e.target.value)
                                      }
                                      className="flex-1 block sm:max-w-md w-full  min-w-0 rounded-md sm:text-sm border-gray-300"
                                      placeholder=".cookieBanner, #ad_overlay"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 max-w-lg">
                                      Hide DOM elements that match given CSS
                                      selectors. Separate multiple selectors
                                      with a comma.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </div>
                </div>

                <div className="px-7 py-6 mt-8 text-left sm:px-6 text-right max-w-7xl">
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
      </div>
    </Layout>
  );
}
