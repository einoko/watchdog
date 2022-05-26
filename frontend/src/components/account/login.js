import React from "react";
import { useForm } from "react-hook-form";
import { setJWT } from "../../utils/loginUtil";

export default function LoginView() {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = React.useState({});

  const onSubmit = async (data) => {
    const response = await fetch("/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (json.errors) {
      setErrors(json.errors);
    } else {
      setJWT(json.token);
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen min-w-screen flex flex-col justify-center">
      <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
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
                    name="username"
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
                    name="password"
                    type="password"
                    {...register("password")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {errors.length > 0 && (
              <div className="mt-5 rounded-md bg-red-50 p-4">
                <div className="flex">
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
            <div>
              <div className="pt-4">
                <p className="text-right text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Forgot your password?
                </p>
              </div>
              <button
                type="submit"
                className="w-full mt-8 text-sm rounded-md p-2 tracking-wide font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="pt-6 text-sm">
            <p className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <a
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign up.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
