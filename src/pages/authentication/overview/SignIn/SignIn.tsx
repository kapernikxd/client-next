import { Button, Col, Form, Input, Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import {
  Link,
  NavLink,
  createSearchParams,
  useNavigate,
} from "react-router-dom";
import { AuthFormWrap } from "../style";
import { Checkbox } from "@app/components/UIElements/checkbox/checkbox";
import { useAppDispatch, useAppSelector } from "@app/store/redux/store";
import { useTranslation } from "react-i18next";
import {
  LoginParams,
  loginAsync,
  loginGoogleAsync,
} from "@app/store/redux/authentication";
import * as _ from "lodash";
import { clearFormvalidation } from "@app/store/redux/formValidator";

interface Props {
  path: string;
}

const SignIn: FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const isLoading = useAppSelector((state) => state.auth.loading);
  const formValidation = useAppSelector((state) => state.formValidation);

  const [state, setState] = useState({
    checked: null,
  });

  const handleGoogleSuccess = async (response: any) => {
    const credential = response?.credential;

    const login = await dispatch(loginGoogleAsync(credential));
    if (!login.type.includes("rejected")) {
      navigate("/");
    }
    // Отправьте токен на ваш сервер для дополнительной проверки и аутентификации пользователя
    // например, с помощью fetch или axios
  };

  const handleSubmit = async ({ email, password }: LoginParams) => {
    const login = await dispatch(loginAsync({ email, password }));

    if (!login.type.includes("rejected")) {
      const { payload }: any = login;
      if (!payload.user.isActivated) {
        navigate({
          pathname: "/auth/confirmEmail",
          search: createSearchParams({
            email,
          }).toString(),
        });
      } else {
        navigate("/");
      }
    }
  };

  const onChange = (checked: any) => {
    setState({ ...state, checked });
  };

  const handleForm = () => {
    if (formValidation.message) {
      dispatch(clearFormvalidation());
    }
  };

  useEffect(() => {
    if (formValidation.hasError) {
      form.validateFields();
    }
  }, [formValidation]);

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
                  () => ({
                    validator() {
                      if (_.find(formValidation.errors, { field: "email" })) {
                        const { message } = _.find(formValidation.errors, {
                          field: "email",
                        });
                        return Promise.reject(message);
                      }
                      return Promise.resolve();
                    },
                  }),
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
                  () => ({
                    validator() {
                      if (
                        _.find(formValidation.errors, { field: "password" })
                      ) {
                        const { message } = _.find(formValidation.errors, {
                          field: "password",
                        });
                        return Promise.reject(message);
                      }
                      return Promise.resolve();
                    },
                  }),
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
                  {isLoading ? t("auth.loading") : t("auth.signIn")}
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

export default SignIn;
