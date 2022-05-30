import React, { useState, useEffect } from "react";
import { getJWT } from "../../utils/loginUtil";
import { Layout } from "../layout/layout";
import { AdminPanel } from "./adminPanel";
import { ChangeEmail } from "./changeEmail";
import { ChangePassword } from "./changePassword";

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
        setUserData(data);
      });
  }, []);

  return (
    <Layout location={location}>
      <div className="lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
        <div className="px-4 pb-0 lg:px-8 lg:pb-12">
        <h1 className="lg:pl-6 mb-5 text-3xl font-bold">Settings</h1>
        </div>

        <ChangeEmail userData={userData} />

        <div className="max-w-4xl mx-4 mx-auto border-t border-gray-300" />

        <ChangePassword userData={userData} />

        <div className="max-w-4xl mx-4 mx-auto border-t border-gray-300" />

        {userData.isAdmin && <AdminPanel />}
      </div>
      </div>
    </Layout>
  );
};
