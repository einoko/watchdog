import { Switch } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { successToast, warningToast } from "../../utils/customToasts";
import { JsonRequest } from "../../utils/fetchUtil";
import { ArrowRightIcon } from "@heroicons/react/outline";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const acceptedMailServices = [
  "126",
  "163",
  "1und1",
  "AOL",
  "DebugMail",
  "DynectEmail",
  "FastMail",
  "GandiMail",
  "Gmail",
  "Godaddy",
  "GodaddyAsia",
  "GodaddyEurope",
  "hot.ee",
  "Hotmail",
  "iCloud",
  "mail.ee",
  "Mail.ru",
  "Maildev",
  "Mailgun",
  "Mailjet",
  "Mailosaur",
  "Mandrill",
  "Naver",
  "OpenMailBox",
  "Outlook365",
  "Postmark",
  "QQ",
  "QQex",
  "SendCloud",
  "SendGrid",
  "SendinBlue",
  "SendPulse",
  "SES",
  "SES-US-EAST-1",
  "SES-US-WEST-2",
  "SES-EU-WEST-1",
  "Sparkpost",
  "Yahoo",
  "Yandex",
  "Zoho",
  "qiye.aliyun",
];

export const AdminPanel = () => {
  const [openSignup, setOpenSignup] = useState(false);
  const [mailService, setMailService] = useState("");
  const [mailUser, setMailUser] = useState("");
  const [mailPass, setMailPass] = useState("");
  const [mailFrom, setMailFrom] = useState("");

  const changeSiteSettings = async (signup) => {
    JsonRequest(
      "POST",
      "/api/admin/site-config",
      {
        openSignup: signup,
        mailService: mailService,
        mailUser: mailUser,
        mailPass: mailPass,
        mailFrom: mailFrom,
      },
    ).then((json) => {
      if (!json.errors) {
        successToast("Settings updated", "Account creation settings updated.");
      } else {
        warningToast(
          "Settings not updated",
          json.errors[0].msg || "Something went wrong."
        );
      }
    });
  };

  useEffect(() => {
    JsonRequest("GET", "/api/admin/site-config").then((data) => {
      setOpenSignup(data.siteConfig.openSignup);
      setMailService(data.siteConfig.mailService);
      setMailUser(data.siteConfig.mailUser);
      setMailPass(data.siteConfig.mailPass);
      setMailFrom(data.siteConfig.mailFrom);
    });
  }, []);

  const handleTestMail = () => {
    JsonRequest("POST", "/api/admin/test-email", {
      mailService: mailService,
      mailUser: mailUser,
      mailPass: mailPass,
      mailFrom: mailFrom,
    }).then((json) => {
      if (!json.errors) {
        successToast("Email sent", "Test email sent.");
      } else {
        warningToast(
          "Email not sent",
          json.errors[0].msg || "Something went wrong."
        );
      }
    });
  };

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
                <ul>
                  <Switch.Group
                    as="li"
                    className="flex items-center justify-between pb-4 border-b border-gray-200"
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
                        changeSiteSettings(!openSignup);
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

                  <li className="py-4 flex items-center justify-between">
                    <div className="flex flex-col w-full">
                      <p className="text-sm font-medium text-gray-900">
                        Mail service
                      </p>
                      <p className="text-sm text-gray-500">
                        The mail service to use for sending emails.
                      </p>
                      <div className="flex flex-col pt-2">
                        <select
                          id="mailService"
                          name="mailService"
                          autoComplete="mailService"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                          value={mailService}
                          onChange={(e) => setMailService(e.target.value)}
                        >
                          {acceptedMailServices.map((service) => {
                            return (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </li>

                  <li className="py-4 flex flex-col items-center justify-between">
                    <div className="col-span-3 sm:col-span-2 w-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sender email
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          id="mailfrom"
                          name="mailfrom"
                          type="text"
                          placeholder="watchdog.monitor@yahoo.com"
                          required
                          value={mailFrom}
                          onChange={(e) => setMailFrom(e.target.value)}
                          className=" flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        />
                      </div>
                    </div>
                  </li>

                  <li className="py-4 flex flex-col items-center justify-between">
                    <div className="col-span-3 sm:col-span-2 w-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mail user
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          id="mailuser"
                          name="mailuser"
                          type="text"
                          required
                          value={mailUser}
                          onChange={(e) => setMailUser(e.target.value)}
                          className=" flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        />
                      </div>
                    </div>
                  </li>

                  <li className="py-4 flex flex-col items-center justify-between">
                    <div className="col-span-3 sm:col-span-2 w-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mail password
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          id="mailpass"
                          name="mailpass"
                          type="password"
                          required
                          value={mailPass}
                          onChange={(e) => setMailPass(e.target.value)}
                          className=" flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="flex justify-between">
                  <button
                    className="py-3 px-4 rounded-md bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold"
                    type="button"
                    onClick={handleTestMail}
                  >
                    Send test mail
                  </button>
                  <button
                    className="py-3 px-4 rounded-md bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold"
                    type="button"
                    onClick={() => {
                      changeSiteSettings(openSignup);
                    }}
                  >
                    Save mail settings
                  </button>
                </div>
                <div className="pt-12">
                  <Link className="" to={"/admin/dashboard"}>
                    <span className="flex items-center hover:underline">
                      <span>Admin dashboard</span>{" "}
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </span>
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
