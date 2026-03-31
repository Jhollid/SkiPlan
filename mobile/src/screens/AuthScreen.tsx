import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenCard } from "../components/ScreenCard";

type Props = {
  onContinue: (email: string) => void;
};

export function AuthScreen({ onContinue }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleContinue() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setErrorMessage("Enter a valid email address to continue.");
      return;
    }
    if (password.trim().length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setErrorMessage(null);
    onContinue(normalizedEmail);
  }

  return (
    <ScreenCard
      title="Sign in or create account"
      subtitle="This keeps the mobile flow aligned with the planned email/password MVP without depending on a running backend yet."
    >
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="jack@example.com"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="At least 8 characters"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <PrimaryButton label="Continue" onPress={handleContinue} />
    </ScreenCard>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "#A23E48",
    fontWeight: "600",
  },
});
