import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@smastrom/react-rating/style.css";
import Root from "./routes/Root/Root";
import PageLayout from "./components/PageLayout/PageLayout";
import "./i18n";
import "./index.scss";

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <PageLayout>
        <Root />
      </PageLayout>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
