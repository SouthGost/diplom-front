// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import Navbar from '../../../navigations/Navbar';
import Requests from '../../../scrypts/request';
import { Training, User } from '../../../types';
import Header from './Header';
import PostsScroll from '../../blocks/PostsScroll';
import { AuthContext } from '../../../context/AuthContext';
import MyHeader from './MyHeader';
import { requestWithToken } from '../../../scrypts/checkRefreshToken';
import MinPost from '../../blocks/MinPost';



export default function Profile({ route, navigation }: any) {
    const { accessToken, setUser, id } = useContext<any>(AuthContext);
    const { profileId } = route.params;
    const [profileInfo, setProfileInfo] = useState<User>();
    // const scrollOffsetY = useRef<Animated.Value>(new Animated.Value(0)).current;

    async function profileInfoLoad() {
        try {
            const res = await Requests.getProfileInfo(profileId);
            if (res.ok) {
                const data = await res.json();
                setProfileInfo(data);
            } else {
                console.log("Плох респонс");
            }
        } catch (err) {
            console.log("Плох респонс");
        }
    }


    useEffect(() => {
        setProfileInfo(undefined);
        profileInfoLoad();

    }, [])


    return (
        <>
            <View style={styles.profile}>
                {/* <Posts navigation={navigation} trainings={trainings}/> */}
                {profileInfo !== undefined ?
                    <PostsScroll
                        header={
                            id === profileId ?
                                <MyHeader profileInfo={profileInfo} navigation={navigation} />
                                :
                                <Header profileInfo={profileInfo} />
                        }
                        length={3}
                        emptyMessage='Начните пробежку в разделе тренировка'
                        loadFunction={(lastId?: number) => {
                            return Requests.getUserTrainings(profileInfo.id, lastId)
                        }}
                        elementView={elem => <MinPost
                            key={`post ${elem.id}`}
                            training={elem}
                            navigation={navigation}
                        />}
                    />
                    :
                    <></>
                }

                {/* {HeaderPostsScroll} */}
            </View>
            <Navbar navigation={navigation} />
        </>
    );
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        paddingTop: 10
    },
    headerText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});