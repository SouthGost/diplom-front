import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';

type myInput_ = {
    placeholder?: string,
    onChange?: ((text: string) => void) | undefined,
    value?: string,
    secureTextEntry?: boolean 
}

export default function MyInput(props: myInput_) {

    return (
        <TextInput
            placeholder={props.placeholder}
            style={styles.input}
            onChangeText={props.onChange}
            value={props.value}
            secureTextEntry={props.secureTextEntry}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "white",
        width: "100%",

        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        
        paddingHorizontal: 10,
        marginVertical: 5,
    },
});