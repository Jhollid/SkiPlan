import { StyleSheet, Text, View } from "react-native";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  eyebrow: {
    color: "#0B3D91",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#14213D",
  },
  subtitle: {
    fontSize: 16,
    color: "#4F5D75",
    lineHeight: 22,
  },
});
