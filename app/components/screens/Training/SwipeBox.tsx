import React, { Component } from 'react';
import defaultStyles from '../../../styles/defaultStyles';
import { Animated, View, StyleSheet, PanResponder, Text, Dimensions, NativeSyntheticEvent, GestureResponderEvent, PanResponderGestureState, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const margin = 0.05 * windowHeight;

enum DrawerState {
    Open = windowHeight - 230,
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

const movementValue = (moveY: number) => windowHeight - moveY;


export default class SwipeBox extends Component<{ children: JSX.Element }> {
    scrollY = new Animated.Value(0);
    state = new Animated.Value(DrawerState.Closed);


    onMoveShouldSetPanResponder = (
        _: GestureResponderEvent,
        { dy }: PanResponderGestureState,
    ) => Math.abs(dy) >= 10;

    onPanResponderMove = (
        _: GestureResponderEvent,
        { moveY }: PanResponderGestureState,
    ) => {
        const val = movementValue(moveY);
        animateMove(this.scrollY, val);
    };

    onPanResponderRelease = (
        _: GestureResponderEvent,
        { moveY }: PanResponderGestureState,
    ) => {
        const valueToMove = movementValue(moveY);
        //@ts-ignore
        const nextState = getNextState(this.state._value, valueToMove, margin);
        this.state.setValue(nextState);
        animateMove(this.scrollY, nextState);
    };

    panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
        onStartShouldSetPanResponderCapture: this.onMoveShouldSetPanResponder,
        onPanResponderMove: (
            _: GestureResponderEvent,
            { moveY }: PanResponderGestureState,
        ) => {
            const val = movementValue(moveY);
            this.scrollY.setValue(-val + 50);
        },
        onPanResponderRelease: this.onPanResponderRelease
    });

    render() {
        return (
            <Animated.View
                style={[
                    styles.box,
                    {
                        transform: [{ translateY: this.scrollY }],
                    }
                ]}

            >
                <View
                    style={styles.boxHead}
                    {...this.panResponder.panHandlers}
                >
                    <Text
                        style={styles.boxHeadText}
                    >
                        Информация о тренировке
                    </Text>
                </View>
                <View style={styles.boxContent}>
                    <ScrollView >
                        {this.props.children}
                    </ScrollView>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        position: "absolute",
        bottom: -windowHeight - 50,
        height: windowHeight + 100,
        width: "100%",
        backgroundColor: 'white',
        borderRadius: 25,
    },
    boxHead: {
        width: "100%",
        height: 45,
        alignItems: "center",
    },
    boxHeadText: {
        ...defaultStyles.h2,
        paddingTop: 5,
        paddingBottom: 5,
        lineHeight: 24,
        fontWeight: 'bold',
        borderBottomColor: "black",
        borderBottomWidth: 1,
        borderBottomStyle: "soled",
        borderBottomStartRadius: 10
    },
    boxContent: {
        height: windowHeight - 230, //200,//
        paddingHorizontal: 15,
        overflow: "hidden"
    }
});