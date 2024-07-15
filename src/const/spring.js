export const LIGHT_SPRING_CONFIG = {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };
  
  export const MEDIUM_SPRING_CONFIG = {
    damping: 15,
    mass: 1,
    stiffness: 300,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };
  
  export const slideTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 300 } },
      close: { animation: 'timing', config: { duration: 300 } },
    },
    screenInterpolator: ({ current, layouts }) => {
      const { progress } = current;
      const { width } = layouts.screen;
  
      const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
      });
  
      return { transform: [{ translateX }] };
    },
  };
  