import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';
import styles from './styles'; // Importing styles from a separate file

const { width, height } = Dimensions.get('window');

const BalloonGame = () => {
  // State variables
  const [balloonsData, setBalloonsData] = useState([]); // Stores data of balloons
  const [playerScore, setPlayerScore] = useState(0); // Stores player score
  const [isGameActive, setIsGameActive] = useState(false); // Indicates whether the game is active or not
  const [timeRemaining, setTimeRemaining] = useState(120); // Remaining time for the game
  const [timeColor, setTimeColor] = useState('black'); // Color for displaying time
  const [balloonSpeed, setBalloonSpeed] = useState(2); // Speed of balloons
  const [balloonCount, setBalloonCount] = useState(5); // Number of balloons in the game
  const [poppedBalloonsCount, setPoppedBalloonsCount] = useState(0); // Count of popped balloons
  const [missedBalloonsCount, setMissedBalloonsCount] = useState(0); // Count of missed balloons
  const [popSound, setPopSound] = useState(); // Sound for balloon pop

  useEffect(() => {
    // Load pop sound
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./assets/pop.mp3'));
      setPopSound(sound);
    };
    loadSound();

    return () => {
      // Unload the sound when component unmounts
      if (popSound) {
        popSound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let timeInterval;
    if (isGameActive) {
      // Update time remaining every second
      timeInterval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime === 0) {
            // End the game if time runs out
            clearInterval(timeInterval);
            setIsGameActive(false);
          } else if (prevTime === 60) {
            // Increase balloon count and speed after 60 seconds
            setBalloonCount(prev => prev + 2);
            setBalloonSpeed(prev => prev + 2);
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timeInterval);
  }, [isGameActive]);

  useEffect(() => {
    let timer;
    let balloonInterval;

    if (isGameActive) {
      // Generate balloons at intervals
      balloonInterval = setInterval(() => {
        if (balloonsData.length < balloonCount) {
          setBalloonsData(prevBalloons => [...prevBalloons, {
            id: Math.random().toString(),
            position: {
              x: Math.random() * (width - 50),
              y: height,
            },
            speed: Math.random() * balloonSpeed + 5,
            opacity: new Animated.Value(1),
          }]);
        }
      }, 1000);

      // Set timer for game duration
      timer = setTimeout(() => {
        clearInterval(balloonInterval);
        setIsGameActive(false);
      }, 120000);

      return () => {
        clearInterval(balloonInterval);
        clearTimeout(timer);
      };
    }
  }, [isGameActive, balloonsData.length]);

  // Handle balloon press event
  const handleBalloonPress = balloonId => {
    setBalloonsData(prevBalloons => prevBalloons.filter(balloon => balloon.id !== balloonId));
    setPlayerScore(prevScore => prevScore + 2);
    setPoppedBalloonsCount(prev => prev + 1);

    // Play pop sound
    if (popSound) {
      popSound.replayAsync();
    }
  };

  // Move balloons upwards
  const moveBalloons = () => {
    setBalloonsData(prevBalloons =>
      prevBalloons.map(balloon => ({
        ...balloon,
        position: {
          x: balloon.position.x,
          y: balloon.position.y - balloon.speed,
        },
      })).filter(balloon => {
        if (balloon.position.y < 140) {
          handleMissedBalloon();
          return false;
        }
        return true;
      })
    );
  };

  // Handle missed balloon
  const handleMissedBalloon = () => {
    setPlayerScore(prevScore => prevScore - 1);
    setMissedBalloonsCount(prev => prev + 1);
  };

  useEffect(() => {
    if (isGameActive) {
      // Move balloons continuously
      const moveInterval = setInterval(moveBalloons, 50);
      return () => clearInterval(moveInterval);
    }
  }, [isGameActive]);

  // Start the game
  const handleGameStart = () => {
    setPlayerScore(0);
    setBalloonsData([]);
    setTimeRemaining(120);
    setIsGameActive(true);
    // Reset popped and missed balloon counts
    setPoppedBalloonsCount(0);
    setMissedBalloonsCount(0);
  };

  // Format time in MM:SS format
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F3EEEA' }]}>
      <Text style={styles.title}>Balloon Game</Text>
      {isGameActive && (
        <>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreColumn}>
              <Text style={[styles.timerText, { color: timeColor }]}>Time Left: {formatTime(timeRemaining)}</Text>
              <Text style={[styles.scoreText, { color: 'green' }]}>Balloons Popped: {poppedBalloonsCount}</Text>
            </View>
            <View style={styles.scoreColumn}>
              <Text style={[styles.scoreText, { color: 'blue' }]}>Total Score: {playerScore}</Text>
              <Text style={[styles.scoreText, { color: 'red' }]}>Balloons Missed: {missedBalloonsCount}</Text>
            </View>
          </View>
          <>
            {balloonsData.map(balloon => (
              <TouchableOpacity key={balloon.id} style={[styles.balloon, { top: balloon.position.y, left: balloon.position.x, opacity: balloon.opacity }]}
                onPress={() => {
                  Animated.timing(balloon.opacity, {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: true,
                  }).start(() => {
                    handleBalloonPress(balloon.id);
                  });
                }}>
                <Image style={styles.balloonImage} source={require('./assets/balloon.png')} />
              </TouchableOpacity>
            ))}
          </>
        </>
      )}
      {!isGameActive && (
        // Display start button when game is not active
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText} onPress={handleGameStart}>{playerScore ? 'Play Again' : 'Start'}</Text>
          {playerScore ? (<Text style={styles.scoreDisplay}>Score: {playerScore}</Text>) : null}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BalloonGame;
