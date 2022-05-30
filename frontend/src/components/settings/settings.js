import { Switch } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { getJWT } from "../../utils/loginUtil";
import { Layout } from "../layout/layout";
import { AdminPanel } from "./adminPanel";
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

  return (
    <Layout location={location}>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">
        <ChangeEmail userData={userData} />
        <ChangePassword userData={userData} />

        {userData.isAdmin && (
          <AdminPanel />
        )}
      </div>
    </Layout>
  );
};
