export const transition = {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: "horizontal",
    gestureResponseDistance: 50,
    cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                            extrapolateRight: "clamp",
                        }),
                    },
                ],
            },
        };
    },
}