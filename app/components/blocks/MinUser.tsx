import React from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, Button, Image } from 'react-native';
import { User } from '../../types';
import defaultStyles from '../../styles/defaultStyles';

type props = {
    user: User,
    navigation: any,
};

export default function MinUser(props: props) {

    function openUser(user: User) {
        props.navigation.navigate('Profile', {
            profileId: user.id,
            // sendTraining: training,
        });
    }

    return (
        <View style={styles.user}>
            <Image
                style={styles.avatar}
                source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
            />
            <View style={styles.nameContainer}>
                <View style={styles.nameContent}>
                    <Text style={styles.text}>
                        {props.user.surname} {props.user.name}
                    </Text>
                </View>
            </View>
            <Button
                title="Открыть"
                onPress={() => {
                    openUser(props.user)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    user: {
        flexDirection: "row",
        alignItems: "center",
        padding: 7,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        // marginLeft: 10,
    },
    nameContainer: {
        flexGrow: 1,
        paddingLeft: 30,
        flexDirection: "row",
    },
    nameContent: {
        justifyContent: "flex-start",
    },
    text: {
        ...defaultStyles.normalText,
        textAlign: "center",
    },

});