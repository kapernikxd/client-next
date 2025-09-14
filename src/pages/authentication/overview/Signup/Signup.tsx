import React, { FC } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";

import { AuthFormWrap } from "../style";
import { Checkbox } from "@app/components/UIElements/checkbox/checkbox";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/StoreProvider";
import { RegistrationParams } from "@/store/mobx/auth";

interface Props {
  path: string;
}

const SignUp: FC<Props> = () => {
  const { authStore } = useStore();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegistrationParams) => {
    try {
      await authStore.registration(values);
      navigate({
        pathname: "/auth/confirmEmail",
        search: createSearchParams({ email: values.email }).toString(),
      });
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

  const handleForm = () => {
    form.setFields([
      { name: "name", errors: [] },
      { name: "lastname", errors: [] },
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
              {t("auth.signUpPllace")}
            </h2>
          </div>
          <div className="pllace-authentication-content">
            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              onChange={handleForm}
              layout="vertical"
            >
              <Form.Item
                label={t("auth.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("auth.validation.name") as string,
                  },
                ]}
              >
                <Input placeholder={t("auth.placeholderName") as string} />
              </Form.Item>
              <Form.Item
                label={t("auth.lastName")}
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: t("auth.validation.lastname") as string,
                  },
                ]}
              >
                <Input placeholder={t("auth.placeholderName") as string} />
              </Form.Item>
              <Form.Item
                name="email"
                label={t("auth.emailAddress")}
                rules={[
                  { type: "email" },
                  {
                    required: true,
                    message: t("auth.validation.email") as string,
                  },
                ]}
              >
                <Input placeholder={t("auth.placeholderEmail") as string} />
              </Form.Item>
              <Form.Item
                label={t("auth.password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("auth.validation.password") as string,
                  },
                  {
                    min: 6,
                    message: t("auth.validation.minPassword6") as string,
                  },
                ]}
              >
                <Input.Password placeholder={t("auth.password") as string} />
              </Form.Item>
              <Form.Item
                name="repeat"
                label={t("auth.confirmPassword")}
                rules={[
                  {
                    required: true,
                    message: t("auth.validation.confirmPassword") as string,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          t("auth.validation.passwordsNotMatch") as string
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={t("auth.password") as string} />
              </Form.Item>
              <div className="pllace-auth-extra-links">
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                t("auth.validation.acceptAgreement") as string
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>{t("auth.policyText")}</Checkbox>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  className="btn-create"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {t("auth.createAccount")}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="pllace-authentication-bottom">
            <p>
              {t("auth.haveAccount")}
              <Link to="/auth">{t("auth.signIn")}</Link>
            </p>
          </div>
        </AuthFormWrap>
      </Col>
    </Row>
  );
};

export default observer(SignUp);
