import React from "react";
import { useForm } from "react-hook-form";
import { successToast, warningToast } from "../../utils/customToasts.js";
import { JsonRequest } from "../../utils/fetchUtil.js";

export const ChangeEmail = ({ userData }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const json = await JsonRequest(
      "POST",
      `/api/account/change-email`,
      {
        username: userData.username,
        email: data.email,
      }
    );

    if (json.errors) {
      warningToast("Error", json.errors[0].msg);
    } else {
      successToast("Success", "Email changed successfully.");
    }
  };

  return (
    <div className="bg-white py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 lg:pl-48">
            Email
          </h3>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register("email")}
                    autoComplete="email"
                    className=" flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="you@example.com"
                    defaultValue={userData.email}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Alerts on detected changes will be sent to this address.
                </p>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
