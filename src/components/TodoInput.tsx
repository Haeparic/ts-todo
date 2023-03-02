import * as css from "../style/style";

import { UserOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import {
  Input,
  DatePicker,
  Radio,
  Button,
  Divider,
  Space,
  Row,
  Tooltip,
  Form,
} from "antd";
import type { DatePickerProps } from "antd";
import type { RadioChangeEvent } from "antd";

import { TodoType } from "../AppContainer";
import { useState } from "react";
import moment from "moment";

type propsType = {
  addTodo: (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => void;
};
const TodoInput = (props: propsType) => {
  // 내용 입력
  const [form] = Form.useForm();
  const { TextArea } = Input;

  // 필수 항목 작성시
  const onFinish = (values: any) => {
    let day = moment(values.date).format("YYYY-MM-DD");
    // console.log("Success:", values);
    // 새로운 아이템
    // const todoItem: TodoType = {
    //   uid: String(new Date().getTime()),
    //   title: values.title,
    //   body: values.body,
    //   done: false,
    //   sticker: values.sticker,
    //   date: day,
    // };
    props.addTodo(
      String(new Date().getTime()),
      values.title,
      values.body,
      false,
      values.sticker,
      day
    );
    // 항목 초기화
    form.resetFields();
  };

  // 항목 누락시
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <css.TodoInputWrap>
      {/* Ant.design Form 이용 */}
      <Form
        name="todoform"
        form={form}
        layout="vertical"
        labelCol={{}}
        wrapperCol={{}}
        style={{ maxWidth: "100%" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="제목"
          name="title"
          rules={[{ required: true, message: "제목을 입력하세요" }]}
        >
          {/* 제목 */}
          <Input
            size="large"
            placeholder="제목을 입력하세요"
            prefix={<UserOutlined />}
            maxLength={20}
            showCount
          />
        </Form.Item>
        {/* 날짜 */}
        <Form.Item
          label="날짜"
          name="date"
          rules={[{ required: true, message: "날짜를 입력하세요" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        {/* 스티커 선택 */}
        <Form.Item
          label="스티커"
          name="sticker"
          rules={[{ required: true, message: "스티커를 선택하세요" }]}
          initialValue={"1"}
        >
          <Radio.Group>
            <Radio value={"1"}>A</Radio>
            <Radio value={"2"}>B</Radio>
            <Radio value={"3"}>C</Radio>
            <Radio value={"4"}>D</Radio>
          </Radio.Group>
        </Form.Item>
        {/* 내용 */}
        <Form.Item
          label="내용"
          name="body"
          rules={[{ required: true, message: "내용을 입력하세요" }]}
        >
          <TextArea
            showCount
            maxLength={100}
            style={{ height: 120, resize: "none" }}
            placeholder="할 일을 입력하세요"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space align="center">
            <Button
              htmlType="reset"
              type="primary"
              danger
              icon={<CloseOutlined />}
            >
              Reset
            </Button>
            <Button htmlType="submit" type="primary" icon={<EditOutlined />}>
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </css.TodoInputWrap>
  );
};

export default TodoInput;
