import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}: Props) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === "secondary" ? styles.buttonSecondary : null,
        disabled ? styles.buttonDisabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, variant === "secondary" ? styles.labelSecondary : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0B3D91",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#E8EEF5",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  labelSecondary: {
    color: "#14213D",
  },
});
