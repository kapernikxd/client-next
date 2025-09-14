import { Spin } from "antd";
import React, { FC, ReactNode, Suspense } from "react";
import { AuthenticationWrap } from "./overview/style";
import { Link } from "react-router-dom";
import AppInstallBanner from "@app/components/AppInstallBanner/AppInstallBanner";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <>
        <AppInstallBanner />
        <AuthenticationWrap
          style={{
            backgroundImage: `url("${require("@app/static/img/pages/admin-bg-light.png")}")`,
          }}
        >
          <div className="pllace-authentication-wrap">
            <div className="pllace-authentication-brand">
              <Link to={"/"}>
                <img src={require(`@assets/svg/logo.svg`)} alt="" />
              </Link>
            </div>
            {children}
          </div>
        </AuthenticationWrap>
      </>
    </Suspense>
  );
};

export default AuthLayout;
