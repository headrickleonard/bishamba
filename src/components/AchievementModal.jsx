import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { PRIMARY_COLOR } from "../styles/styles";
import COLORS from "../const/colors";
const AchievementModal = ({ isVisible, onClose, level }) => {
  return (
    <Modal
      animationType="slide"
      //   transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.modalText}>
            You've reached the {level} level in your agricultural journey. Keep
            up the great work!
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Okay got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 4,
    color:COLORS.yellow
  },
});

export default AchievementModal;
