import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, NativeScrollEvent } from 'react-native';
import { AuthContext } from './../../context/AuthContext';
import checkRefreshToken from './../../scrypts/checkRefreshToken';
import Requests from './../../scrypts/request';
import { Training } from './../../types';
import MinPost from './../blocks/MinPost';
import defaultStyles from '../../styles/defaultStyles';

type props = {
    loadFunction: (lastId?: number) => Promise<any>,
    header?: JSX.Element,
    emptyMessage?: string,
    length: number,
    elementView: (elem: any) => JSX.Element,
}

export default function PostsScroll(props: props) {
    const { accessToken, setUser } = useContext<any>(AuthContext);
    const [elements, setElements] = useState<Training[]>();
    const [isFinishRequest, setIsFinishRequest] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    // elements Elements
    function checkEnd(newElements: Training[]) {
        if (newElements.length < props.length) {
            setIsEnd(true);
        }
    }

    async function setLoadElements(res: Response) {
        const data = await res.json();
        checkEnd(data.elements); // aga
        setElements((prevElements) => {
            if (prevElements !== undefined)
                return [
                    ...prevElements,
                    ...data.elements
                ];
            return data.elements
        });
    }

    async function loadElements(lastID?: number) {
        setIsFinishRequest(false);
        try {
            console.log("Начало!!!");
            let res = await props.loadFunction(lastID);
            if (res.ok) {
                setLoadElements(res);
                console.log("КОНЕЦ???");
            } else {
                const refreshData = await checkRefreshToken(setUser);

                if (refreshData) {
                    res = await props.loadFunction(lastID);
                    if (res.ok) {
                        setLoadElements(res);
                    } else {
                        console.log("Не хороший ответ");
                    }
                }
            }
        } catch (err) {
            console.log("Плох респонс");
        }
        setIsFinishRequest(true);
    }

    useEffect(() => {
        setElements(undefined)
        loadElements();
        console.log("zagruz")
    }, [props.loadFunction]);

    function loadNextTraings() {
        if (elements !== undefined) {
            loadElements(elements[elements.length - 1].id);
        }
    }

    function isAllowLoadNext({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) {
        const triggerBottomDistance = 100;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - triggerBottomDistance;

        return isBottom && !isEnd && isFinishRequest;
    }

    return (
        <>
            {elements === undefined ?
                <View style={styles.content}>
                    <ActivityIndicator size={100} />
                </View>
                :
                elements.length == 0 ?
                    <>
                        {props.header !== undefined ?
                            props.header
                            :
                            <></>
                        }
                        <View style={styles.emptyMessage} >{/*style={styles.emptyMessage} */}
                            <Text style={styles.emptyMessageText}>{props.emptyMessage ? props.emptyMessage : "Пусто"}</Text>
                        </View>
                    </>
                    :
                    <ScrollView
                        onScroll={({ nativeEvent }) => {
                            if (isAllowLoadNext(nativeEvent)) {
                                loadNextTraings();
                            }
                        }}
                    >
                        {props.header !== undefined ?
                            props.header
                            :
                            <></>
                        }
                        {elements.map(
                            props.elementView
                        )}
                    </ScrollView >
            }
        </>

    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyMessage: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyMessageText: {
        textAlign: "center",
        ...defaultStyles.normalText,
    }
});