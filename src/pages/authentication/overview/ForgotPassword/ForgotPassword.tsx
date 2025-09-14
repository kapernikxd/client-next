import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Row, Col } from "antd";
import { AuthFormWrap } from "../style";
import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/StoreProvider";

interface Props {
  path: string;
}

const ForgotPassword: FC<Props> = ({ path = "" }) => {
  const { t } = useTranslation();
  const { authStore } = useStore();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleChange = () => {
    form.setFields([{ name: "email", errors: [] }]);
  };

  const handleSubmit = async (values: any) => {
    const { email } = values;
    try {
      const res = await authStore.activateEmail(email);
      if (res.user) {
        navigate({
          pathname: "/auth/confirmEmail",
          search: createSearchParams({ email, reset: "true" }).toString(),
        });
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

export default observer(ForgotPassword);
