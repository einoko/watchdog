import { Switch } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { successToast } from "../../utils/customToasts";
import { getJWT } from "../../utils/loginUtil";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const AdminPanel = () => {
  const [openSignup, setOpenSignup] = useState(false);

  const changeAccountCreation = async () => {
    await fetch("/api/admin/site-config", {
      method: "POST",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        openSignup: !openSignup,
      }),
    }).then((res) => {
      if (res.status === 200) {
        successToast("Settings updated", "Account creation settings updated.");
      }
    });
  };

  useEffect(() => {
    fetch("/api/admin/site-config", {
      method: "GET",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setOpenSignup(data.siteConfig.openSignup);
        });
      }
    });
  }, []);

  return (
    <div className="bg-white py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 lg:pl-48">
            Admin settings
          </h3>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <ul className="divide-y divide-gray-200">
                  <Switch.Group
                    as="li"
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <Switch.Label
                        as="p"
                        className="text-sm font-medium text-gray-900"
                        passive
                      >
                        Open Sign Up
                      </Switch.Label>
                      <Switch.Description className="text-sm text-gray-500">
                        When disabled, new accounts cannot be created.
                      </Switch.Description>
                    </div>
                    <Switch
                      id="signupToggle"
                      className={classNames(
                        openSignup ? "bg-teal-500" : "bg-gray-200",
                        "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      )}
                      defaultChecked={openSignup}
                      onChange={() => {
                        setOpenSignup(!openSignup);
                        changeAccountCreation();
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          openSignup ? "translate-x-5" : "translate-x-0",
                          "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </ul>
                <div className="pt-12">
                  <Link
                    className="py-3 px-4 rounded-md bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold"
                    to={"/admin/dashboard"}
                  >
                    Open admin dashboard
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
