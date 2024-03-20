// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10},
  scoreContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  scoreColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    backgroundColor: "#F3EEEA",
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  timerText: {
    backgroundColor: "#F3EEEA",
    fontSize: 14,
    padding: 10,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  balloon: {
    position: 'absolute',
  },
  balloonImage: {
    width: 55,
    height: 55
  },
  startButton: {
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#0000ff",
    color: "#fff",
    borderRadius: 10,
    minWidth: 200,
    textAlign: 'center'
  },
  scoreDisplay: {
    fontSize: 18,
    color: "black"
  },
});

export default styles;
