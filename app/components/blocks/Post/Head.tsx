import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Training } from '../../../types';
import defaultStyles from '../../../styles/defaultStyles';
import { Tooltip } from 'react-native-paper';
import Requests from '../../../scrypts/request';


type post = {
    training: Training,
    navigation: any,
};

export default function Head(props: post) {

    function openProfile(profileId: number) {
        props.navigation.navigate('Profile', {
            profileId,
        });
    }

    return (
        <View
            style={styles.userInfo}
        >
            <Pressable
                onPress={() => {
                    openProfile(props.training.user.id)
                }}
            >
                <Image
                    style={styles.avatar}
                    source={{
                        uri: Requests.getAvatar(props.training.user.avatar),
                    }}
                />
            </Pressable>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{props.training.user.name} {props.training.user.surname}</Text>
            </View>
            <View style={styles.medalContainer}>
                {props.training.best_distance ?
                    <Tooltip
                        title="Длинная тренировка"
                    >
                        <Image
                            style={styles.medal}
                            source={require("../../../../assets/distance.png")}
                        />
                    </Tooltip>
                    :
                    <></>
                }

                {props.training.best_pace ?
                    <Tooltip
                        title="Лучшая скорость"
                    >
                        <Image
                            style={styles.medal}
                            source={require("../../../../assets/pace.png")}
                        />
                    </Tooltip>
                    :
                    <></>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: "row",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    medalContainer: {
        flexGrow: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    medal: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    text: {
        ...defaultStyles.normalText,
        textAlign: "center",
    },
    nameContainer: {
        justifyContent: "center",
    },
    name: {
        ...defaultStyles.h2,
        paddingHorizontal: 20,

    },
});