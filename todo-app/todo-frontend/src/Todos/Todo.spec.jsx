import { render, screen } from "@testing-library/react";
import Todo from "./Todo.jsx";

const dummyTodo = {
  text: "this is a test todo",
  done: false,
};
const dummyFn1= vi.fn()

test("text is rendered", async () => {
  render(<Todo todo={dummyTodo} onClickComplete={dummyFn1} onClickDelete={dummyFn1} />);

  expect(screen.getByText("this is a test todo")).toBeDefined();
});
