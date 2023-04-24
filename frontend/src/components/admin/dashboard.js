import React from "react";
import { Layout } from "../layout/layout";
import { Statistics } from "./statistics";
import { UsersTable } from "./usersTable";

export const Dashboard = () => {
  return (
    <Layout location={window.location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <main className="-mt-24 pb-8">
              <div className="max-w-3xl pt-24 mx-auto lg:max-w-7xl">
                <h1 className="sr-only">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-4 lg:gap-8">
                  <div className="sm:px-6 lg:px-0 grid grid-cols-1 gap-4 lg:col-span-1">
                    <section aria-labelledby="section-1-title">
                      <div className="bg-white overflow-hidden">
                        <div className="p-0">
                          <Statistics />
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="sm:px-8 grid grid-cols-1 col-span-3 gap-4">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <UsersTable />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};
