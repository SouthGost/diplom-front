import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, NativeScrollEvent, Pressable, Image } from 'react-native';
import { AuthContext } from './../../../context/AuthContext';
import Navbar from '../../../navigations/Navbar';
import checkRefreshToken from '../../../scrypts/checkRefreshToken';
import Requests from '../../../scrypts/request';
import { Training } from '../../../types';
import MinPost from '../../blocks/MinPost';
import PostsScroll from '../../blocks/PostsScroll';
import defaultStyles from '../../../styles/defaultStyles';

export default function Search({ navigation }: any) {

    return (
        <>
            <View style={styles.header}>
                <Pressable
                    onPress={() => {
                    }}
                >
                    <Image
                        style={styles.searchIcon}
                        source={require("../../../../assets/search.png")}
                    />
                </Pressable>
            </View>

            <PostsScroll
                navigation={navigation}
                loadFunction={Requests.getFeed}
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