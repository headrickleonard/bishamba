import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HistoryFilterChip = ({ data, selectedChip, onSelectChip }) => {
  return (
    <View style={styles.chipsContainer}>
      {data.map((term, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.chip,
            selectedChip === term && styles.selectedChip
          ]}
          onPress={() => onSelectChip(term)}
        >
          <Text style={styles.chipText}>{term}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedChip: {
    backgroundColor: "#ddd",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
});

export default HistoryFilterChip;
