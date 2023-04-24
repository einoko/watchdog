import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { setJWT } from "../../utils/loginUtil";
import { JsonRequest } from "../../utils/fetchUtil";

export default function LoginView() {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = React.useState([]);

  const onSubmit = async (data) => {
    const json = await JsonRequest(
      "POST",
      `/api/account/login`,
      data
    );

    if (json.errors) {
      setErrors(json.errors);
    } else {
      setJWT(json.token);
      localStorage.setItem("username", json.user.username);
      localStorage.setItem("email", json.user.email);
      localStorage.setItem("userId", json.user.id);
      window.location.reload();
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
                <div className="rounded-md bg-red-50 p-4 border border-red-900/5">
                  <div className="flex">
                    <div className="ml-3">
                      <div className="text-sm text-red-800">
                        {errors.map((error, i) => (
                          <p key={i}>{error.msg}</p>
                        ))}
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
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
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
                Sign in
              </button>
            </div>
          </form>
          <div className="pt-6 text-sm">
            <p className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="font-semibold text-gray-700 hover:text-gray-800"
              >
                Sign up.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
