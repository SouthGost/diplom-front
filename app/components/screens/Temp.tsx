import React, { Component } from 'react';
import { Animated, View, StyleSheet, PanResponder, Text, Dimensions, NativeSyntheticEvent, GestureResponderEvent, PanResponderGestureState, ScrollView } from 'react-native';
import Map from './../blocks/Map';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';


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


export default class App extends Component {
    scrollY = new Animated.Value(0);
    state = new Animated.Value(DrawerState.Closed);


    onMoveShouldSetPanResponder = (
        _: GestureResponderEvent,
        { dy }: PanResponderGestureState,
    ) => true;//Math.abs(dy) >= 10;

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
            // Animated.timing(this.scrollY, {
            //     toValue: -val,
            //     useNativeDriver: true,
            // }).start();
            this.scrollY.setValue(-val);
        },//this.onPanResponderMove,
        onPanResponderRelease: this.onPanResponderRelease
    });

    render() {
        return (
            <View style={styles.container}>

                <Map points={[]} />
                <Animated.View
                    style={[
                        styles.box,
                        {
                            transform: [{ translateY: this.scrollY }],
                        }
                    ]}

                >
                    {/* <View style={styles.box} /> */}
                    <Text
                        style={styles.boxHead}
                        {...this.panResponder.panHandlers}
                    >Drag & Release this box!</Text>
                    <View style={styles.boxContent}>
                        <ScrollView >
                            <View style={{padding: 10}}>
                                <MultiSlider
                                    min={0}
                                    max={100}
                                    values={[10, 20]}
                                    onValuesChange={(event)=>{
                                        console.log(event)
                                    }}
                                />

                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>
                            <View>
                                <Text>qwe</Text>
                            </View>

                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        position: "absolute",
        top: windowHeight - 50,
        height: windowHeight + 100,
        width: "100%",
        backgroundColor: 'white',
        borderRadius: 25,

    },
    boxHead: {
        fontSize: 14,
        lineHeight: 24,
        width: "100%",
        height: 50,
        fontWeight: 'bold',
        color: "black",
        // backgroundColor: 'gray',
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    boxContent: {
        height: windowHeight - 230,
        paddingLeft: 25,
        overflow: "hidden",
        // backgroundColor: 'gray',
    }
});