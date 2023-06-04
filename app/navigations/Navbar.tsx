import React from 'react';
import { useState, useContext } from 'react';
import defaultStyles from '../styles/defaultStyles';
import { AuthContext } from './../context/AuthContext';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';

export default function Navbar({ navigation }: any) {
    const { id } = useContext<any>(AuthContext);

    return (
        <View style={styles.navbar}>
            <View
                style={styles.elem}
            >
                <Button
                    title="Главная"
                    color={defaultStyles.colors.praimaryColor}
                    onPress={() => navigation.navigate('Home')}

                />
            </View>
            <View
                style={styles.elem}
            >
                <Button
                    title="Тренировка"
                    color={defaultStyles.colors.praimaryColor}
                    onPress={() => navigation.navigate('StartTraining')}
                />
            </View>
            <View
                style={styles.elem}
            >
                <Button
                    title="Профиль"
                    color={defaultStyles.colors.praimaryColor}
                    onPress={() => navigation.navigate('Profile', {
                        profileId: id,
                    })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        backgroundColor: '#fff',
        justifyContent: "space-around",
    },
    elem: {
        flex: 1
    }
});
