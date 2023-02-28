import { TodoType } from "../AppContainer";
import { Button, List, Space } from "antd";

type propsType = {
  todoItem: TodoType;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
};

const TodoListItem = (props: propsType) => {
  return (
    <List.Item>
      <Space>
        {props.todoItem.title}
        {props.todoItem.body}
        {props.todoItem.date}
      </Space>
      <Space>
        <Button>Edit</Button>
        <Button danger>Delete</Button>
      </Space>
    </List.Item>
  );
};

export default TodoListItem;
