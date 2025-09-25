import React from 'react';
import { Form, Input, Button } from 'antd';

/**
 * Renders a form for configuring Gnosis Safe address and stablecoin.
 * This form is used by administrators to set up the organization's payout settings.
 */
const SettingsForm = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Gnosis Safe Address"
        name="safeAddress"
        rules={[{ required: true, message: 'Please input the Gnosis Safe address!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Stablecoin"
        name="stablecoin"
        rules={[{ required: true, message: 'Please input the stablecoin!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SettingsForm;