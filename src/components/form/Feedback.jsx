import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const options = [
  { name: 'Terrible', icon: '😩' },
  { name: 'Bad', icon: '🙁' },
  { name: 'OK', icon: '😐' },
  { name: 'Good', icon: '🙂' },
  { name: 'Great', icon: '😃' },
];

const OPTION_SIZE = 56;

export default function Feedback() {
  const [value, setValue] = React.useState(2);
//   const sheet = React.useRef();

//   React.useEffect(() => {
//     sheet.current.open();
//   }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.placeholder}>
        <View style={styles.placeholderInset}>
          {/* Replace with your content */}
        </View>
      </View>

     
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeaderTitle}>
            Rate your experience
          </Text>
        </View>
        <View style={styles.sheetBody}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{options[value].name}</Text>
          </View>
          <View style={styles.options}>
            {options.map((item, index) => {
              const isActive = value === index;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.option,
                    isActive && { borderColor: '#efc15d' },
                  ]}
                  onPress={() => {
                    setValue(index);
                  }}>
                  <Text style={styles.optionText}>{item.icon}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Sheet */
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetHeader: {
    padding: 24,
  },
  sheetHeaderTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1f2633',
  },
  sheetBody: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  /** Badge */
  badge: {
    alignSelf: 'center',
    backgroundColor: '#fbefd5',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef8838',
    textTransform: 'uppercase',
  },
  /** Option */
  option: {
    width: OPTION_SIZE,
    height: OPTION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbefd5',
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#000',
  },
  /** Button */
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#efc15d',
    marginBottom: 12,
    backgroundColor: '#efc15d',
  },
  btnText: {
    fontSize: 17,
    fontWeight: '600',
  },
});