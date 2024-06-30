// screen.js
import { Dimensions } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const imagePath = "../assets/images/onboard";
// const imagePath = '../assets/images'; // Ensure this path is correct

export const screens = [
  {
    id: 1,
    title: "Monitor Crop Health Easily",
    description:
      "Leverage advanced scanning technology to keep your crops healthy and detect diseases early. Stay ahead of potential issues with timely insights and actions.",
    image: require(`${imagePath}/onboarding1.png`),
  },
  {
    id: 2,
    title: "Optimize Yield and Reduce Losses",
    description:
      "Maximize your crop yield and minimize losses with our data-driven farming solutions. Implement best practices tailored to your needs and boost your productivity.",
    image: require(`${imagePath}/onboarding2.png`),
  },
  {
    id: 3,
    title: "Get Real-time Alerts and Expert Support",
    description:
      "Receive instant alerts on potential crop issues and connect with agricultural experts for immediate support. Ensure your farm is always operating at its best.",
    image: require(`${imagePath}/onboarding3.png`),
  },
  {
    id: 4,
    title: "Promote Sustainable Farming",
    description:
      "Adopt sustainable farming practices that enhance soil health, conserve water, and increase biodiversity. Contribute to a healthier environment while boosting your farm’s productivity.",
    image: require(`${imagePath}/onboarding4.png`),
  },
];

