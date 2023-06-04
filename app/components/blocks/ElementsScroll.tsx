import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, NativeScrollEvent } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import checkRefreshToken from '../../scrypts/checkRefreshToken';
import Requests from '../../scrypts/request';
import Post from './Post';
import defaultStyles from '../../styles/defaultStyles';

type props = {
    loadFunction: (lastId?: number) => Promise<any>,
    header?: JSX.Element,
    emptyMessage: string,
    length: number,
    elementView: (elem: any) => JSX.Element,
}

export default React.memo(function ElementsScroll(props: props) {
    const { accessToken, setUser } = useContext<any>(AuthContext);
    const [elements, setElements] = useState<any[]>();
    const [isFinishRequest, setIsFinishRequest] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    function checkEnd(newElements: any[]) {
        if (newElements.length < props.length) {
            setIsEnd(true);
        }
    }

    async function setLoadElements(res: Response) {
        const data = await res.json();
        checkEnd(data.elements);
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
            let res = await props.loadFunction(lastID);
            if (res.ok) {
                setLoadElements(res);
            } else {
                const refreshData = await checkRefreshToken(setUser);

                if (refreshData) {
                    res = await props.loadFunction(lastID);
                    if (res.ok) {
                        setLoadElements(res);
                    }
                }
            }
        } catch (err) { }
        setIsFinishRequest(true);
    }

    useEffect(() => {
        setElements(undefined)
        loadElements();
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
                        <View style={styles.emptyMessage} >
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
})

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