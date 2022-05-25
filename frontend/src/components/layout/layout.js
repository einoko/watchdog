import React from "react";
import { Header } from "./header.js";
import { Footer } from "./footer.js";

export const Layout = ({ children, location }) => {
  return (
    <div>
      <div className="flex h-full min-h-screen flex-col justify-between">
        <div>
          <Header location={location} />
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
};
