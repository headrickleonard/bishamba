import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { postToCommunity } from "../api";
import LottieView from "lottie-react-native";
import AnimatedDropdown from "../components/AnimatedDropdown";
import { createPost } from "../api";
import { useAuth } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const questions = [
  {
    id: "plantType",
    question: "What type of plant is it?",
    options: ["Herb", "Shrub", "Tree", "Flower", "Vegetable", "Fruit", "Other"],
  },
  {
    id: "plantPart",
    question: "Which part of the plant is affected?",
    options: ["Leaves", "Stem", "Roots", "Flowers", "Fruits", "Whole plant"],
  },
  {
    id: "symptoms",
    question: "What symptoms do you see?",
    options: [
      "Discoloration",
      "Spots",
      "Wilting",
      "Holes",
      "Mold",
      "Stunted growth",
      "Other",
    ],
  },
  {
    id: "duration",
    question: "How long have you noticed these symptoms?",
    options: [
      "Just noticed",
      "Few days",
      "A week",
      "Several weeks",
      "A month or more",
    ],
  },
];

const AskCommunity = ({ route, navigation }) => {
  const { photoUri, plantName } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useAuth();

  const scrollY = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  const headerHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(scrollY.value > 100 ? height * 0.2 : height * 0.4, {
        duration: 300,
      }),
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  useEffect(() => {
    cardOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    cardTranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [currentStep]);

  const handleNext = () => {
    if (answers[questions[currentStep].id]) {
      cardOpacity.value = 0;
      cardTranslateY.value = 50;
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert("Please select an option");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      cardOpacity.value = 0;
      cardTranslateY.value = 50;
      setCurrentStep(currentStep - 1);
    }
  };

  const constructDescription = () => {
    let description = `I need help with my ${plantName || "plant"}. `;
    description += `It's a ${answers.plantType} and the ${answers.plantPart} is affected. `;
    description += `I've noticed ${answers.symptoms} for ${answers.duration}. `;
    if (additionalInfo) {
      description += `Additional information: ${additionalInfo}`;
    }
    return description;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const content = constructDescription();
    try {
      if (!accessToken) {
        navigation.navigate("Auth", { returnScreen: "Details" });
        // throw new Error('No access token found');
      }

      const images = [{ uri: photoUri }];
      const response = await createPost(accessToken, content, images);

      Toast.show({
        type: "success",
        text1: "Your question has been posted to the community!",
        visibilityTime: 5000,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to post your question. Please retry!",
        visibilityTime: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerHeight]}>
        <Image source={{ uri: photoUri }} style={styles.headerImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.headerText}>Ask the Community</Text>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.card, cardStyle]}>
          {currentStep < questions.length ? (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {questions[currentStep].question}
              </Text>
              <AnimatedDropdown
                options={questions[currentStep].options}
                onSelect={(option) =>
                  setAnswers({
                    ...answers,
                    [questions[currentStep].id]: option,
                  })
                }
                placeholder="Select an option"
              />
              <View style={styles.buttonContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.finalStep}>
              <Text style={styles.finalStepText}>
                Any additional information?
              </Text>
              <TextInput
                style={styles.additionalInfoInput}
                multiline
                numberOfLines={4}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Enter any additional details here..."
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator size={24} color={"#fff"} />
                ) : (
                  <Text style={styles.buttonText}>Submit to Community</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scrollContent: {
    paddingTop: height * 0.4,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  questionContainer: {
    alignItems: "center",
    minHeight: 300,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  finalStep: {
    alignItems: "center",
  },
  finalStepText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  additionalInfoInput: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: "top",
    borderColor: "#4a90e2",
    borderWidth: 2,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  loadingAnimation: {
    width: 50,
    height: 50,
  },
});

export default AskCommunity;
