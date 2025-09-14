import { Button, Col, Form, Input, Row } from "antd";
import React, { FC, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import {
  Link,
  NavLink,
  createSearchParams,
  useNavigate,
} from "react-router-dom";
import { AuthFormWrap } from "../style";
import { Checkbox } from "@app/components/UIElements/checkbox/checkbox";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/StoreProvider";
import { LoginParams } from "@/store/mobx/auth";

interface Props {
  path: string;
}

const SignIn: FC<Props> = () => {
  const navigate = useNavigate();
  const { authStore } = useStore();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [state, setState] = useState({
    checked: null,
  });

  const handleGoogleSuccess = async (response: any) => {
    const credential = response?.credential;
    try {
      await authStore.loginByGoogle(credential);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async ({ email, password }: LoginParams) => {
    try {
      const data = await authStore.login({ email, password });
      if (!data.user.isActivated) {
        navigate({
          pathname: "/auth/confirmEmail",
          search: createSearchParams({ email }).toString(),
        });
      } else {
        navigate("/");
      }
    } catch (e: any) {
      if (e && typeof e === "object") {
        const fields = Object.entries(e).map(([name, message]) => ({
          name,
          errors: [message as string],
        }));
        form.setFields(fields);
      }
    }
  };

  const onChange = (checked: any) => {
    setState({ ...state, checked });
  };

  const handleForm = () => {
    form.setFields([
      { name: "email", errors: [] },
      { name: "password", errors: [] },
    ]);
  };

  return (
    <Row justify="center">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <AuthFormWrap>
          <div className="pllace-authentication-top">
            <h2 className="pllace-authentication-top__title">
              {t("auth.signInPllace")}
            </h2>
          </div>
          <div className="pllace-authentication-content">
            <Form
              name="login"
              form={form}
              onFinish={handleSubmit}
              onChange={handleForm}
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    message: t("auth.validation.emailOrUsername") as string,
                    required: true,
                  },
                ]}
                initialValue="testuser1@gmail.com"
                label={t("auth.usernameOrEmail")}
              >
                <Input placeholder={t("auth.placeholderEmail") as string} />
              </Form.Item>
              <Form.Item
                name="password"
                initialValue="1234567890"
                label={t("auth.password")}
                rules={[
                  {
                    required: true,
                    message: t("auth.validation.newPassword") as string,
                  },
                  {
                    min: 6,
                    message: t("auth.validation.minPassword6") as string,
                  },
                ]}
              >
                <Input.Password placeholder={t("auth.password") as string} />
              </Form.Item>
              <div className="pllace-auth-extra-links">
                <Checkbox onChange={onChange} checked={state.checked}>
                  {t("auth.keepMeLoggedIn")}
                </Checkbox>
                <NavLink className="forgot-pass-link" to={"forgotPassword"}>
                  {t("auth.forgotPassword")}?
                </NavLink>
              </div>
              <Form.Item>
                <Button
                  className="btn-signin"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {authStore.loading ? t("auth.loading") : t("auth.signIn")}
                </Button>
              </Form.Item>
              <p className="pllace-form-divider">
                <span>Or</span>
              </p>
              <ul className="pllace-social-login">
                {/* <li> */}
                <Link className="google-social" to="#">
                  <GoogleOAuthProvider
                    clientId={`${process.env.GOOGLE_CLIENT_ID}`}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => console.log("Error")}
                    />
                  </GoogleOAuthProvider>
                </Link>
                {/* </li> */}
              </ul>
            </Form>
          </div>
          <div className="pllace-authentication-bottom">
            <p>
              {t("auth.noHaveAccount")}
              <Link to="register">{t("auth.signUp")}</Link>
            </p>
          </div>
        </AuthFormWrap>
      </Col>
    </Row>
  );
};

export default observer(SignIn);
