import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/StoreProvider";

const InputGroup = Input.Group;

interface Props {
  path: string;
}

const ConfirmEmail: FC<Props> = () => {
  const { authStore } = useStore();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const reset = searchParams.get("reset");

  if (!email) {
    navigate("/auth/forgotPassword");
  }

  const handleChange = () => {
    form.setFields([{ name: "code", errors: [] }]);
  };

  const handleSubmit = async (values: any) => {
    const { code1, code2, code3 } = values;
    const code = code1 + code2 + code3;

    try {
      if (email && reset) {
        const res = await authStore.resetPassword({
          verificationCode: code,
          email: decodeURIComponent(email),
        });
        if (res.link) {
          navigate(`/auth/resetPassword/${res.link}`);
        }
      } else if (email) {
        const res = await authStore.otp({
          verificationCode: code,
          email: decodeURIComponent(email),
        });
        if (res.user) {
          res.user.isActivated
            ? navigate("/")
            : navigate("/auth/forgotPassword");
        }
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
                  ({ getFieldValue }) => ({
                    validator() {
                      if (
                        getFieldValue("code1") &&
                        getFieldValue("code2") &&
                        getFieldValue("code3")
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

export default observer(ConfirmEmail);
