import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { TextInput, View, Text, Keyboard, StyleSheet, NativeScrollEvent, KeyboardAvoidingView, Image } from 'react-native';
import Requests from '../../../scrypts/request';
import ElementsScroll from '../../blocks/ElementsScroll';
import defaultStyles from '../../../styles/defaultStyles';
import FoundUser from './FoundUser';

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
            <ElementsScroll
                length={10}
                loadFunction={(lastId) => Requests.getUsers(search, lastId)}
                emptyMessage='Таких пользователей нет'
                elementView={elem =>
                    <FoundUser
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
        backgroundColor: defaultStyles.colors.praimaryColor,
        height: 50,
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 10,
    },
    input: {
        paddingLeft: 75,
        width: 400,
        ...defaultStyles.normalText,
        color: "white",
    },
    searchIcon: {
        width: 30,
        height: 30,
    },
});