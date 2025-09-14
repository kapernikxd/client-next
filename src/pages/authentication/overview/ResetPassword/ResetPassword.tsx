import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/StoreProvider";

interface Props {
  path: string;
}

const ResetPassword: FC<Props> = ({ path = "" }) => {
  const { t } = useTranslation();
  const { authStore } = useStore();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { link } = useParams();

  if (!link) {
    navigate("/auth");
  }

  const handleChange = () => {
    form.setFields([{ name: "password", errors: [] }]);
  };

  const handleSubmit = async (values: any) => {
    try {
      const res = await authStore.newPassword({
        password: values.password,
        activatedLink: link as string,
      });
      if (res.user) {
        navigate("/auth");
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

export default observer(ResetPassword);
