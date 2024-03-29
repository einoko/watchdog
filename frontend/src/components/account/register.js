import React from "react";
import { useForm } from "react-hook-form";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { Link, useNavigate } from "react-router-dom";
import { JsonRequest } from "../../utils/fetchUtil";

export default function RegisterView() {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const json = await JsonRequest(
      "POST",
      `/api/account/signup`,
      data
    );

    if (json.errors) {
      setErrors(json.errors);
    } else {
      setMessage(json.msg);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen min-w-screen flex flex-col justify-center">
      <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-8 pt-8">
          <img src={"/watchdog_logo.svg"} alt="Watchdog logo" />
        </div>
        <div className="pb-10 px-10 pt-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {errors.length > 0 && (
                <div className="mt-5 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm text-red-700">
                        {errors.map((error) => (
                          <p key={error.msg}>{error.msg}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {message.length > 0 && (
                <div className="mt-5 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Account created
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Your account was successfully created. You will be
                          automatically redirected to the login page in 5
                          seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    type="text"
                    {...register("username")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                  <span className="opacity-80 text-sm">
                    {" "}
                    (min. 6 characters)
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    minLength={6}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full mt-8 text-sm rounded-md p-2 tracking-wide font-medium bg-gray-700 text-white hover:bg-gray-800 focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="pt-6 text-sm">
            <p className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-gray-700 hover:text-gray-800"
              >
                Sign in.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
