import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { TextInput, View, Text, Keyboard, StyleSheet, NativeScrollEvent, KeyboardAvoidingView, Image } from 'react-native';
import { AuthContext } from './../../../context/AuthContext';
import Navbar from '../../../navigations/Navbar';
import Requests from '../../../scrypts/request';
import { Training } from '../../../types';
import MinPost from '../../blocks/MinPost';
import PostsScroll from '../../blocks/PostsScroll';
import defaultStyles from '../../../styles/defaultStyles';
import MinUser from '../../blocks/MinUser';

export default function Search({ navigation }: any) {
    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log("search", search)
    }, [search]);

    return (
        <>

            {/* <KeyboardAvoidingView> */}
            <View style={styles.header}>
                <TextInput
                    style={styles.input}
                    placeholder="Найти..."
                    placeholderTextColor={"white"}
                    onSubmitEditing={(e) => {
                        setSearch(e.nativeEvent.text);
                        Keyboard.dismiss();
                    }}
                />

                {/* <Pressable
                    onPress={() => {
                    }}
                >
                    <Image
                        style={styles.searchIcon}
                        source={require("../../../../assets/search.png")}
                    />
                </Pressable> */}
            </View>

            {/* <View style={{ flexGrow: 1 }}> */}
            <PostsScroll
                length={10}
                loadFunction={(lastId) => Requests.getUsers(search, lastId)}
                emptyMessage='Таких пользователей нет'
                elementView={elem =>
                    <MinUser
                        key={`post ${elem.id}`}
                        user={elem}
                        navigation={navigation}
                    />
                }
            />
            {/* </View> */}
            {/* <View > */}
            {/* <Navbar navigation={navigation} /> */}
            {/* </View> */}
            {/* </KeyboardAvoidingView> */}
        </>
    );
}

const styles = StyleSheet.create({

    header: {
        // flex: 0,
        backgroundColor: defaultStyles.colors.praimaryColor,
        height: 50,
        flexDirection: 'row',
        // justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    input: {
        paddingLeft: 75,
        // borderWidth: 0.5,
        // borderRadius: 4,
        width: 400,
        ...defaultStyles.normalText,
        color: "white",
    },
    searchIcon: {
        width: 30,
        height: 30,
    },
});