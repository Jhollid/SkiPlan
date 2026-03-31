import { StyleSheet, Text, View } from "react-native";

type Option = {
  label: string;
  value: string;
  helper?: string;
};

type Props = {
  label: string;
  selectedValue: string;
  options: Option[];
  helper?: string;
  onSelect: (value: string) => void;
};

export function SelectableChipGroup({
  label,
  selectedValue,
  options,
  helper,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <Text
              key={option.value}
              style={[styles.chip, isSelected ? styles.chipSelected : null]}
              onPress={() => onSelect(option.value)}
            >
              {option.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontWeight: "600",
    color: "#14213D",
  },
  helper: {
    color: "#4F5D75",
    fontSize: 12,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E8EEF5",
    color: "#234",
    overflow: "hidden",
  },
  chipSelected: {
    backgroundColor: "#0B3D91",
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
