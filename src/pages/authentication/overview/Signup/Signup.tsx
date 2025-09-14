import React, { FC, useEffect, useState } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";

import { AuthFormWrap } from "../style";
import { Checkbox } from "@app/components/UIElements/checkbox/checkbox";
import { useAppDispatch, useAppSelector } from "@app/store/redux/store";
import { useTranslation } from "react-i18next";
import {
  RegistrationParams,
  registrationAsync,
} from "@app/store/redux/authentication";
import { clearFormvalidation } from "@app/store/redux/formValidator";
import * as _ from "lodash";

interface Props {
  path: string;
}

const SignUp: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const formValidation = useAppSelector((state) => state.formValidation);

  const handleSubmit = async (values: RegistrationParams) => {
    const registration = await dispatch(registrationAsync(values));
    if (!registration.type.includes("rejected")) {
      navigate({
        pathname: "/auth/confirmEmail",
        search: createSearchParams({
          email: values.email,
        }).toString(),
      });
    }
  };

  const handleForm = () => {
    dispatch(clearFormvalidation());
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
                  () => ({
                    validator() {
                      if (_.find(formValidation.errors, { field: "name" })) {
                        const { message } = _.find(formValidation.errors, {
                          field: "name",
                        });
                        return Promise.reject(message);
                      }
                      return Promise.resolve();
                    },
                  }),
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
                  () => ({
                    validator() {
                      if (
                        _.find(formValidation.errors, { field: "lastname" })
                      ) {
                        const { message } = _.find(formValidation.errors, {
                          field: "lastname",
                        });
                        return Promise.reject(message);
                      }
                      return Promise.resolve();
                    },
                  }),
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

export default SignUp;
