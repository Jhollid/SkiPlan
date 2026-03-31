import { fireEvent, render, screen } from "@testing-library/react-native";

import { AuthScreen } from "../screens/AuthScreen";


describe("AuthScreen", () => {
  it("shows a validation error for an invalid email", () => {
    const onContinue = jest.fn();

    render(<AuthScreen onContinue={onContinue} />);

    fireEvent.changeText(screen.getByPlaceholderText("jack@example.com"), "jack");
    fireEvent.changeText(screen.getByPlaceholderText("At least 8 characters"), "password123");
    fireEvent.press(screen.getByText("Continue"));

    expect(screen.getByText("Enter a valid email address to continue.")).toBeTruthy();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("normalizes email and continues for valid credentials", () => {
    const onContinue = jest.fn();

    render(<AuthScreen onContinue={onContinue} />);

    fireEvent.changeText(screen.getByPlaceholderText("jack@example.com"), " Jack@Example.com ");
    fireEvent.changeText(screen.getByPlaceholderText("At least 8 characters"), "password123");
    fireEvent.press(screen.getByText("Continue"));

    expect(onContinue).toHaveBeenCalledWith("jack@example.com");
  });
});
