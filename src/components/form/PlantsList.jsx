import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { PRIMARY_COLOR } from '../../styles/styles';

const items = [
  { icon: 'carrot', label: 'Tomato' },
  { icon: 'carrot', label: 'Corn' },
  { icon: 'carrot', label: 'Lettuce' },
  { icon: 'carrot', label: 'Carrot' },
  { icon: 'pepper-hot', label: 'Pepper' },
  { icon: 'carrot', label: 'Broccoli' },
  { icon: 'carrot', label: 'Spinach' },
  { icon: 'carrot', label: 'Potato' },
];

export default function PlantsList({onSelectPlant }) {
  const [value, setValue] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Identify the Plant</Text>
          <Text style={styles.headerSubtitle}>
            Choose the plant crop that you think matches the scanned plant.
          </Text>
        </View>
        {items.map(({ icon, label }, index) => {
          const isActive = value === index;
          return (
            <View
              key={index}
              style={[
                styles.radioWrapper,
                index === 0 && { borderTopWidth: 0 },
              ]}>
              <TouchableOpacity
                onPress={() => {
                //   setValue(index);
                  onSelectPlant(index)
                }}
                activeOpacity={0.8}
                >
                <View style={styles.radio}>
                  <View style={styles.radioIcon}>
                    <FontAwesome
                      color="#fff"
                      name={icon}
                      size={20} />
                  </View>
                  <Text style={styles.radioLabel}>{label}</Text>
                  <View
                    style={[
                      styles.radioCheck,
                      isActive && styles.radioCheckActive,
                    ]}>
                    <FontAwesome
                      color="#fff"
                      name="check"
                      style={!isActive && { display: 'none' }}
                      size={12} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    marginTop: 6,
  },
  /** Radio */
  radio: {
    position: 'relative',
    paddingRight: 24,
    paddingLeft: 0,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  radioWrapper: {
    marginLeft: 24,
    borderTopWidth: 1,
    borderColor: '#e8e8e8',
  },
  radioIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#000',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  radioCheck: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    // borderColor: '#007bff',
  },
  radioCheckActive: {
    backgroundColor: PRIMARY_COLOR,
  },
});
