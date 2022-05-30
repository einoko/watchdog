import { Switch } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { getJWT } from "../../utils/loginUtil";
import { Layout } from "../layout/layout";
import { ChangeEmail } from "./changeEmail";
import { ChangePassword } from "./changePassword";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const SettingsView = ({ location }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`/api/account/${localStorage.getItem("userId")}`, {
      headers: {
        Authorization: getJWT(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserData(data);
      });
  }, []);

  const isAdmin = true;
  const accountCreation = true;
  return (
    <Layout location={location}>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">
        <ChangeEmail userData={userData} />
        <ChangePassword userData={userData} />

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
      </div>
    </Layout>
  );
};
