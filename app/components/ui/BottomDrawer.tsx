import { Animated, Dimensions, GestureResponderEvent, PanResponder, PanResponderGestureState, View } from "react-native";
import React from "react"

const { height } = Dimensions.get('window');
enum DrawerState {
    Open = height - 230,
    Peek = 230,
    Closed = 0,
}

const animateMove = (
    y: Animated.Value,
    toValue: number | Animated.Value,
    callback?: any,
) => {
    Animated.spring(y, {
        toValue: -toValue,
        tension: 20,
        useNativeDriver: true,
    }).start((finished) => {
        /* Optional: But the purpose is to call this after the the animation has finished. Eg. Fire an event that will be listened to by the parent component */
        finished && callback && callback();
    });
};

const getNextState = (
    currentState: DrawerState,
    val: number,
    margin: number,
): DrawerState => {
    switch (currentState) {
        case DrawerState.Peek:
            return val >= currentState + margin
                ? DrawerState.Open
                : val <= DrawerState.Peek - margin
                    ? DrawerState.Closed
                    : DrawerState.Peek;
        case DrawerState.Open:
            return val >= currentState
                ? DrawerState.Open
                : val <= DrawerState.Peek
                    ? DrawerState.Closed
                    : DrawerState.Peek;
        case DrawerState.Closed:
            return val >= currentState + margin
                ? val <= DrawerState.Peek + margin
                    ? DrawerState.Peek
                    : DrawerState.Open
                : DrawerState.Closed;
        default:
            return currentState;
    }
};



interface BottomDrawerProps {
    children?: React.ReactNode;
    // onDrawerStateChange: (nextState: DrawerState) => void;
}

const BottomDrawer: React.FunctionComponent<BottomDrawerProps> = ({
    children,
    // onDrawerStateChange,
}) => {
    // const { height } = Dimensions.get('window');
    const y = React.useRef(new Animated.Value(DrawerState.Closed)).current;
    const state = React.useRef(new Animated.Value(DrawerState.Closed)).current;
    const margin = 0.05 * height;
    const movementValue = (moveY: number) => height - moveY;

    const onPanResponderMove = (
        _: GestureResponderEvent,
        { moveY }: PanResponderGestureState,
    ) => {
        const val = movementValue(moveY);
        animateMove(y, val);
    };

    const onPanResponderRelease = (
        _: GestureResponderEvent,
        { moveY }: PanResponderGestureState,
    ) => {
        const valueToMove = movementValue(moveY);
        const nextState = getNextState(state._value, valueToMove, margin);
        state.setValue(nextState);
        animateMove(y, nextState/*, onDrawerStateChange(nextState)*/);
    };
    const onMoveShouldSetPanResponder = (
        _: GestureResponderEvent,
        { dy }: PanResponderGestureState,
    ) => Math.abs(dy) >= 10;

    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
            onPanResponderMove,
            onPanResponderRelease,
        }),
    ).current;

    return (
        <Animated.View
            style={[
                {
                    width: '100%',
                    height: height,
                    backgroundColor: '#fff',
                    borderRadius: 25,
                    position: 'absolute',
                    bottom: -height + 30,
                    transform: [{ translateY: y }],
                },
            ]}
            {...panResponder.panHandlers}>
            <View style={{
                 marginTop: 25,
                 marginRight: 0,
                 marginBottom: 15,
                 marginLeft: 0,
                 height: 1,
                 width: "100%",
                 backgroundColor: "#D3D3D3",
            }}>

            </View>
            {children}
        </Animated.View>
    );
};

export default BottomDrawer;