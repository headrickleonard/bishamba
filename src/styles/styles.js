import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const HEIGHT_FACTOR = 50;
export const PRIMARY_COLOR = "#32c759"
export const SECONDARY_COLOR="#007bff"

const styles = StyleSheet.create({
  header: {
    height: height / 2 + HEIGHT_FACTOR,
    width: '100%',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  closeIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionIcons: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  overviewContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  overviewItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 16,
  },
  overviewText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#6d6d6e",
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 12,
  },
  overviewContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  recommendedContainer: {
    padding: 16,
  },
  recommendedItem: {
    width: 200,
    marginRight: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    shadowColor: "#0078",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 1,
    margin:1
  },
  recommendedImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    objectFit:"fill"
  },
  recommendedName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recommendedDescription: {
    fontSize: 14,
    color: "#666",
  },
  warningCard: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff5f5",
    borderColor: "red",
    borderWidth: 1,
  },
});
export default styles;
