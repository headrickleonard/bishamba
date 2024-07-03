import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const items = [
  {
    title: 'Organic Tomatoes',
    img: 'https://images.unsplash.com/photo-1587307250511-3ba402860e8e?q=80&w=3430&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fresh organic tomatoes, perfect for salads and sauces',
    price: 2.99,
  },
  {
    title: 'Fresh Carrots',
    img: 'https://images.unsplash.com/photo-1582515060723-27d5bb6b6e0b?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Crunchy and sweet, great for snacking or cooking',
    price: 1.49,
  },
  {
    title: 'Green Bell Peppers',
    img: 'https://images.unsplash.com/photo-1598043063694-cf90cf1e21fb?q=80&w=3468&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Crisp and fresh, ideal for stir-fries and salads',
    price: 3.49,
  },
  {
    title: 'Organic Lettuce',
    img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Leafy and green, perfect for making fresh salads',
    price: 2.49,
  },
  {
    title: 'Strawberries',
    img: 'https://images.unsplash.com/photo-1600974591618-0a7d1a9b35f0?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sweet and juicy, great for desserts and snacks',
    price: 4.99,
  },
];

export default function ScanHistory() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Agricultural Products</Text>

        <ScrollView>
          {items.map(({ img, title, description, price }, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // handle onPress
                }}
                style={styles.card}>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{title}</Text>

                  <Text style={styles.cardDescription}>{description}</Text>

                  <Text style={styles.cardPrice}>
                    ${price.toLocaleString('en-US')}
                  </Text>
                </View>

                <Image
                  alt=""
                  resizeMode="cover"
                  source={{ uri: img }}
                  style={styles.cardImg} />

                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.cardAdd}>
                  <FontAwesome
                    color="#1d1d1d"
                    name="plus"
                    size={11} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Card */
  card: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderStyle: 'solid',
    borderRadius: 12,
    marginBottom: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 24,
    color: '#1d1d1d',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    marginBottom: 6,
    color: '#706f7b',
  },
  cardPrice: {
    fontWeight: '700',
    fontSize: 14,
  },
  cardImg: {
    width: 120,
    height: '100%',
    borderRadius: 12,
  },
  cardAdd: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    zIndex: 9,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
