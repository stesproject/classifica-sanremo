import React from "react";
import Header from "../Header/Header";

const PageLayout = (props: React.PropsWithChildren) => {
  return (
    <>
      <Header />
      <div className="p-8 mt-10">{props.children}</div>
    </>
  );
};

export default PageLayout;
