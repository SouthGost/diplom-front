import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Result = {
    name: string,
    value: string,
}


export default function Result(props: Result) {

    return (
        <View style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexGrow: 1,
            // borderColor: "black",
            // borderWidth: 1,
            // borderStyle: "solid",
        }}>
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: "center",
                }}
            >
                {props.name}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    textAlign: "center",
                }}
            >
                {props.value}
            </Text>
        </View>
    )
}