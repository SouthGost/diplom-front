import React, { useState, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import Navbar from '../../../navigations/Navbar';
import Requests from '../../../scrypts/request';
import { Training, User } from '../../../types';
import Header from './Header';
import ElementsScroll from '../../blocks/ElementsScroll';
import { AuthContext } from '../../../context/AuthContext';
import MyHeader from './MyHeader';
import { requestWithToken } from '../../../scrypts/checkRefreshToken';
import Post from '../../blocks/Post';



export default function Profile({ route, navigation }: any) {
    const { profileId } = route.params;
    const { id } = useContext<any>(AuthContext);
    const [profileInfo, setProfileInfo] = useState<User>();

    async function profileInfoLoad() {
        try {
            const res = await Requests.getProfileInfo(profileId);
            if (res.ok) {
                const data = await res.json();
                setProfileInfo(data);
            }
        } catch (err) {}
    }

    useEffect(() => {
        setProfileInfo(undefined);
        profileInfoLoad();
    }, [profileId])

    return (
        <>
            <View style={styles.profile}>
                {profileInfo !== undefined ?
                    <ElementsScroll
                        header={
                            id === profileId ?
                                <MyHeader profileInfo={profileInfo} navigation={navigation} />
                                :
                                <Header profileInfo={profileInfo} />
                        }
                        length={3}
                        emptyMessage='Еще нет тренировок'
                        loadFunction={(lastId?: number) => {
                            return Requests.getUserTrainings(profileInfo.id, lastId)
                        }}
                        elementView={elem => <Post
                            key={`post ${elem.id}`}
                            training={elem}
                            navigation={navigation}
                        />}
                    />
                    :
                    <></>
                }
            </View>
            <Navbar navigation={navigation} />
        </>
    );
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        backgroundColor: '#fff',
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