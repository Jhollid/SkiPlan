import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14213D",
  },
  description: {
    color: "#4F5D75",
    lineHeight: 20,
  },
});
