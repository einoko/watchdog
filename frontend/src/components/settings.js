import { Switch } from "@headlessui/react";
import React from "react";
import { Layout } from "./layout/layout";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const SettingsView = ({ location }) => {
  const isAdmin = true;
  const accountCreation = true;
  return (
    <Layout location={location}>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Email
              </h3>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        placeholder="you@example.com"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Alerts on detected changes will be sent to this address.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Password
              </h3>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current password
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="password"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New password
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="password"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm password
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        autoComplete="password"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Admin settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  These settings can only be changed by the admin account.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form action="#" method="POST">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <ul role="list" className="mt-2 divide-y divide-gray-200">
                        <Switch.Group
                          as="li"
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <Switch.Label
                              as="p"
                              className="text-sm font-medium text-gray-900"
                              passive
                            >
                              Enable new account creation
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              When disabled, new accounts cannot be created.
                            </Switch.Description>
                          </div>
                          <Switch
                            className={classNames(
                              accountCreation ? "bg-teal-500" : "bg-gray-200",
                              "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                accountCreation
                                  ? "translate-x-5"
                                  : "translate-x-0",
                                "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save settings
          </button>
        </div>
      </div>
    </Layout>
  );
};
