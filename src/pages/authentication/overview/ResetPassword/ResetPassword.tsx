import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash";
import { useAppDispatch, useAppSelector } from "@app/store/redux/store";
import { clearFormvalidation } from "@app/store/redux/formValidator";
import { newPasswordAsync } from "@app/store/redux/authentication";

interface Props {
  path: string;
}

const ResetPassword: FC<Props> = ({ path = "" }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const formValidation = useAppSelector((state) => state.formValidation);
  const { link } = useParams();

  if (!link) {
    navigate("/auth");
  }

  const handleChange = () => {
    dispatch(clearFormvalidation());
  };

  const handleSubmit = async (values: any) => {
    const isEmailExist = await dispatch(
      newPasswordAsync({ password: values.password, activatedLink: link })
    );

    if (isEmailExist.payload.user) {
      navigate("/auth");
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
            onChange={handleChange}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <div className="pllace-authentication-top">
              <h2 className="pllace-authentication-top__title">
                {t("auth.resetPassword")}
              </h2>
            </div>
            <div className="pllace-authentication-content">
              <p className="forgot-text">{t("auth.enterNewPassword")}</p>
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

export default ResetPassword;
