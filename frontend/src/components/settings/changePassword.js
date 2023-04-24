import React from "react";
import { useForm } from "react-hook-form";
import { successToast, warningToast } from "../../utils/customToasts";
import { JsonRequest } from "../../utils/fetchUtil";

export const ChangePassword = ({ userData }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      warningToast("Error", "Passwords do not match.");
      return;
    }

    const json = await JsonRequest("POST", `/api/account/change-password`, {
      username: userData.username,
      password: data.password,
      newPassword: data.newPassword,
    });

    if (json.errors) {
      warningToast("Error", json.errors[0].msg);
    } else {
      successToast("Success", "Password changed successfully.");
    }
  };

  return (
    <div className="bg-white py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 lg:pl-48">
            Password
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
                  Current password
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    required
                    {...register("password")}
                    autoComplete="password"
                    className=" flex-1 block w-full rounded-md sm:text-sm border-gray-300"
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
                    id="newPassword"
                    type="password"
                    required
                    {...register("newPassword")}
                    autoComplete="password"
                    className="flex-1 block w-full rounded-md sm:text-sm border-gray-300"
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
                    type="password"
                    required
                    {...register("confirmPassword")}
                    autoComplete="password"
                    className="flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  />
                </div>
                <div className="flex justify-end pt-5">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Change Password
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
