import React, { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { UserCircleIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { removeJWT } from "../../utils/loginUtil";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const Header = ({ location }) => {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  return (
    <header>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-white font-extrabold text-2xl tracking-wide">
                      <a href="/">Watchdog</a>
                    </span>
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <Link
                        to={"/"}
                        className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        New Job
                      </Link>
                      <Link
                        to={"/jobs"}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Jobs
                      </Link>
                      <Link
                        to={"/settings"}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-gray-800 flex hover:text-white text-gray-300 text-sm p-2 rounded-full focus:outline-none">
                          <FaUser className="w-5 h-5 mr-2" />
                          <span className="font-semibold text-md">
                            {username}
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  removeJWT();
                                  window.location.reload();
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block text-left w-full px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                <Disclosure.Button
                  as="a"
                  href="/"
                  className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  New Job
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/jobs"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Jobs
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/settings"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Settings
                </Disclosure.Button>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div>
                    <div className="text-base font-medium text-white">
                      {username}
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      {email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => {
                      removeJWT();
                      window.location.reload();
                    }}
                    className="block text-left w-full px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
};
