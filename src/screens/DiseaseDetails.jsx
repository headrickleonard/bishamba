import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { getDiseaseData } from '../api/index';
import ScreenWrapper from '../components/shared/ScreenWrapper';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4; // 40% of screen width

const DiseaseDetails = ({ route, navigation }) => {
  const { disease } = route.params;
  const [fullDiseaseData, setFullDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFullDiseaseData();
  }, []);

  const fetchFullDiseaseData = async () => {
    try {
      const data = await getDiseaseData(disease.diseasesCode);
      setFullDiseaseData(data.data);
    } catch (error) {
      console.error('Error fetching full disease data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (product) => {
    navigation.navigate('Details', { product });
  };

  const renderTreatmentItem = (item) => (
    <View key={item.productId} style={styles.treatmentItem}>
      <Image source={{ uri: item.images[0] }} style={styles.treatmentImage} />
      <View style={styles.treatmentInfo}>
        <Text style={styles.treatmentName} numberOfLines={2}>{item.productName}</Text>
        <TouchableOpacity 
          style={styles.orderButton}
          // onPress={() => navigation.navigate('ProductDetails', { product: item })}
          onPress={() => handleOrder(item)}

        >
          <Text style={styles.orderButtonText}>Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: disease.analyzedImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{disease.commonName}</Text>
          <Text style={styles.subtitle}>Disease Code: {disease.diseasesCode}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>Category: {disease.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#2196F3" />
            <Text style={styles.infoText}>Confidence: {disease.confidence}%</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={24} color="#FF9800" />
            <Text style={styles.infoText}>
              Date: {new Date(disease.createdDate).toLocaleDateString()}
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Comments</Text>
          <Text style={styles.comment}>{disease.comment}</Text>
          
          {fullDiseaseData && (
            <>
              <Text style={styles.sectionTitle}>Cause</Text>
              <Text style={styles.description}>{fullDiseaseData.cause}</Text>

              <Text style={styles.sectionTitle}>Symptoms</Text>
              <Text style={styles.description}>{fullDiseaseData.symptoms}</Text>

              <Text style={styles.sectionTitle}>Management</Text>
              <Text style={styles.description}>{fullDiseaseData.management}</Text>

              <Text style={styles.sectionTitle}>Recommended Treatments</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.treatmentsContainer}>
                {fullDiseaseData.recommendedTreatment.map(renderTreatmentItem)}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  comment: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  treatmentsContainer: {
    marginTop: 10,
  },
  treatmentItem: {
    width: CARD_WIDTH,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  treatmentImage: {
    width: '100%',
    height: CARD_WIDTH, // Make it square
    resizeMode: 'cover',
  },
  treatmentInfo: {
    padding: 10,
  },
  treatmentName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    height: 20, // Adjust as needed
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DiseaseDetails;