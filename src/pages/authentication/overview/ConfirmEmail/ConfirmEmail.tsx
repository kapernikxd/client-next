import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/store/redux/store";
import {
  resetPasswordAsync,
  verificateEmailAsync,
} from "@app/store/redux/authentication";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  addValidationError,
  clearFormvalidation,
} from "@app/store/redux/formValidator";
import * as _ from "lodash";

const InputGroup = Input.Group;

interface Props {
  path: string;
}

const ConfirmEmail: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const formValidation = useAppSelector((state) => state.formValidation);
  const isActivated = useAppSelector((state) => state.auth.user.isActivated);
  const email = searchParams.get("email");
  const reset = searchParams.get("reset");

  if (!email) {
    dispatch(
      addValidationError({
        message: "Please, enter email one more time!",
        errors: [{ field: "email" }],
      })
    );
    navigate("/auth/forgotPassword");
  }

  const handleChange = () => {
    dispatch(clearFormvalidation());
  };

  const handleSubmit = async (values: any) => {
    const { code1, code2, code3 } = values;
    const code = code1 + code2 + code3;

    if (email && reset) {
      const resetPassword = await dispatch(
        resetPasswordAsync({
          verificationCode: code,
          email: decodeURIComponent(email),
        })
      );
      if (resetPassword.payload.link) {
        const { payload } = resetPassword;
        navigate(`/auth/resetPassword/${payload.link}`);
      }
      return;
    } else {
      const verificateEmail = await dispatch(
        verificateEmailAsync({
          verificationCode: code,
          email: decodeURIComponent(email as string),
        })
      );
      if (verificateEmail.payload.user) {
        const { payload } = verificateEmail;
        payload.user.isActivated
          ? navigate("/")
          : navigate("/auth/forgotPassword");
      }
      return;
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
            name="confirmEmail"
            onChange={handleChange}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <div className="pllace-authentication-top">
              <h2 className="pllace-authentication-top__title">
                {t("auth.confirmEmail")}
              </h2>
            </div>
            <div className="pllace-authentication-content">
              <p className="forgot-text center">{t("auth.confirmEmailText")}</p>
              <Form.Item
                label={t("auth.codeLabel")}
                name="code"
                rules={[
                  () => ({
                    validator() {
                      if (_.find(formValidation.errors, { field: "code" })) {
                        const { message } = _.find(formValidation.errors, {
                          field: "code",
                        });
                        return Promise.reject(message);
                      }
                      return Promise.resolve();
                    },
                  }),
                  ({ getFieldValue }) => ({
                    validator() {
                      if (
                        !_.isEmpty(getFieldValue("code1")) &&
                        !_.isEmpty(getFieldValue("code2")) &&
                        !_.isEmpty(getFieldValue("code3"))
                      ) {
                        return Promise.resolve();
                      }
                      if (
                        getFieldValue("code1") &&
                        !_.isEmpty(getFieldValue("code2")) &&
                        !_.isEmpty(getFieldValue("code3"))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("auth.validation.code") as string)
                      );
                    },
                  }),
                ]}
              >
                <InputGroup size="large">
                  <Row gutter={8}>
                    <Col span={5}>
                      <Form.Item
                        name="code1"
                        noStyle
                        rules={[
                          {
                            min: 3,
                            message: t("auth.validation.minChar3") as string,
                          },
                          {
                            pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                            message: t("auth.validation.noSpace") as string,
                          },
                        ]}
                      >
                        <Input maxLength={3} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        name="code2"
                        noStyle
                        rules={[
                          {
                            min: 3,
                            message: t("auth.validation.minChar3") as string,
                          },
                          {
                            pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                            message: t("auth.validation.noSpace") as string,
                          },
                        ]}
                      >
                        <Input maxLength={3} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        name="code3"
                        noStyle
                        rules={[
                          {
                            min: 3,
                            message: t("auth.validation.minChar3") as string,
                          },
                          {
                            pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                            message: t("auth.validation.noSpace") as string,
                          },
                        ]}
                      >
                        <Input maxLength={3} />
                      </Form.Item>
                    </Col>
                  </Row>
                </InputGroup>
              </Form.Item>
              <Form.Item>
                <Button
                  className="btn-reset"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {t("auth.send")}
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

export default ConfirmEmail;
