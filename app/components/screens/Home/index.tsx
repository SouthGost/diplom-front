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

export default function Home({ navigation }: any) {

    return (
        <>
            <PostsScroll
                navigation={navigation}
                loadFunction={Requests.getFeed}
                emptyMessage='Подпишитесь на спортсменов, чтобы видеть их тренировки'
            />

            <Navbar navigation={navigation} />
        </>

    );
}