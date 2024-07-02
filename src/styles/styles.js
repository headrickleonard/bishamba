import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const HEIGHT_FACTOR = 50;

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
    color:"#6d6d6e",
    fontFamily:"serif"
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 12,
  },
});

export default styles;
