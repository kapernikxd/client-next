import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import * as _ from "lodash";
import { useAppDispatch, useAppSelector } from "@app/store/redux/store";
import { clearFormvalidation } from "@app/store/redux/formValidator";
import { activateEmailAsync } from "@app/store/redux/authentication";

interface Props {
  path: string;
}

const ForgotPassword: FC<Props> = ({ path = "" }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const formValidation = useAppSelector((state) => state.formValidation);

  const handleChange = () => {
    dispatch(clearFormvalidation());
  };

  const handleSubmit = async (values: any) => {
    const { email } = values;
    const isEmailExist = await dispatch(activateEmailAsync(email));

    if (isEmailExist.payload.user) {
      navigate({
        pathname: "/auth/confirmEmail",
        search: createSearchParams({
          email,
          reset: "true",
        }).toString(),
      });
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
          <Form
            form={form}
            name="forgotPass"
            onChange={handleChange}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <div className="pllace-authentication-top">
              <h2 className="pllace-authentication-top__title">
                {t("auth.forgotPassword")}?
              </h2>
            </div>
            <div className="pllace-authentication-content">
              <p className="forgot-text">{t("auth.forgotPasswordText")}</p>
              <Form.Item
                label={t("auth.emailAddress")}
                name="email"
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
              <Form.Item>
                <Button
                  className="btn-reset"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {t("auth.sendResetInstructions")}
                </Button>
              </Form.Item>
            </div>
            <div className="pllace-authentication-bottom">
              <p className="return-text">
                {t("auth.returnTo")}
                <Link to="/auth">{t("auth.signIn")}</Link>
              </p>
            </div>
          </Form>
        </AuthFormWrap>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
