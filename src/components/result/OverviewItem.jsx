import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import styles from "../../styles/styles";

const OverviewItem = ({ iconName, iconColor, title, description }) => {
  return (
    <View style={styles.overviewItem} className="bg-neutral-300/20 rounded-xl p-2">
      <View className="flex flex-row items-center justify-start mb-2">
        <View className="border border-slate-400/20 rounded-lg p-1">
          <Icon name={iconName} size={24} color={iconColor} />
        </View>
        <Text style={styles.boldText}>{title}</Text>
      </View>
      <Text style={styles.overviewText}>{description}</Text>
    </View>
  );
};

export default OverviewItem;
