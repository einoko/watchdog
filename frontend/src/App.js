import React from "react";
import "./App.css";
import { Layout } from "./components/layout/layout";

import "react-image-crop/dist/ReactCrop.css";
import { JobForm } from "./components/jobForm";

export default function App({ location }) {
  return (
    <Layout location={location}>
      <div className="lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 pt-6 lg:pt-8">
          <div className="px-4 pb-0 lg:px-8 lg:pb-12">
            <h1 className="lg:pl-8 text-3xl font-bold">New monitoring job</h1>
            <JobForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
