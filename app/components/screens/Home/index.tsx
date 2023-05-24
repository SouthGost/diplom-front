import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, NativeScrollEvent, Pressable, Image } from 'react-native';
import { AuthContext } from './../../../context/AuthContext';
import Navbar from '../../../navigations/Navbar';
import Requests from '../../../scrypts/request';
import { Training } from '../../../types';
import MinPost from '../../blocks/MinPost';
import PostsScroll from '../../blocks/PostsScroll';
import defaultStyles from '../../../styles/defaultStyles';

export default function Home({ navigation }: any) {
    const { id } = useContext<any>(AuthContext);

    return (
        <>
            <View style={styles.header}>
                <Pressable
                    onPress={() => {
                        navigation.navigate('Search');
                    }}
                >
                    <Image
                        style={styles.searchIcon}
                        source={require("../../../../assets/search.png")}
                    />
                </Pressable>
            </View>
            <PostsScroll
                length={3}
                loadFunction={(lastID) => Requests.getFeed(id, lastID)}
                emptyMessage='Подпишитесь на спортсменов, чтобы видеть их тренировки'
                elementView={elem => <MinPost
                    key={`post ${elem.id}`}
                    training={elem}
                    navigation={navigation}
                />}
            />

            <Navbar navigation={navigation} />
        </>

    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: defaultStyles.colors.praimaryColor,
        height: 50,
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    searchIcon: {
        width: 30,
        height: 30,
    },
});