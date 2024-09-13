import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnimatedDropdown = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const animation = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    animation.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    toggleDropdown();
  };

  const arrowStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animation.value, [0, 1], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const dropdownStyle = useAnimatedStyle(() => {
    const height = interpolate(animation.value, [0, 1], [0, options.length * 50], Extrapolate.CLAMP);
    const opacity = interpolate(animation.value, [0, 1], [0, 1], Extrapolate.CLAMP);
    return {
      height,
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleDropdown} activeOpacity={0.7}>
        <Text style={[styles.headerText, selectedOption && styles.selectedText]}>
          {selectedOption ? selectedOption : placeholder}
        </Text>
        <Animated.View style={arrowStyle}>
          <Ionicons name="chevron-down" size={24} color="#4a90e2" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.optionsContainer, dropdownStyle]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => selectOption(option)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    marginBottom: 20,
    padding:2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4a90e2',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 16,
    color: '#888',
  },
  selectedText: {
    color: '#333',
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4a90e2',
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AnimatedDropdown;