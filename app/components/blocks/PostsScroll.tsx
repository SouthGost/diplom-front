import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, NativeScrollEvent } from 'react-native';
import { AuthContext } from './../../context/AuthContext';
import Navbar from './../../navigations/Navbar';
import checkRefreshToken from './../../scrypts/checkRefreshToken';
import Requests from './../../scrypts/request';
import { Training } from './../../types';
import MinPost from './../blocks/MinPost';
import defaultStyles from '../../styles/defaultStyles';

type props = {
    navigation: any,
    loadFunction: (lastId?: number) => Promise<any>,
    header?: JSX.Element,
    emptyMessage?: string
}

export default function PostsScroll(props: props) {
    const { accessToken, setUser } = useContext<any>(AuthContext);
    const [trainings, setTrainings] = useState<Training[]>();
    const [isFinishRequest, setIsFinishRequest] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    function checkEnd(trainings_: Training[]) {
        if (trainings_.length < 3) {
            setIsEnd(true);
        }
    }

    async function setLoadTrainings(res: Response) {
        const data = await res.json();
        checkEnd(data.trainings);
        if (trainings !== undefined) {
            setTrainings([
                ...trainings,
                ...data.trainings
            ]);
        } else {
            setTrainings(data.trainings);
        }
    }

    async function loadTrainings(lastID?: number) {
        setIsFinishRequest(false);
        try {
            console.log("Начало!!!");
            let res = await props.loadFunction(lastID);
            if (res.ok) {
                setLoadTrainings(res);
                console.log("КОНЕЦ???");
            } else {
                const refreshData = await checkRefreshToken(setUser);

                if (refreshData) {
                    res = await props.loadFunction(lastID);
                    if (res.ok) {
                        setLoadTrainings(res);
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
        loadTrainings();
    }, []);

    function loadNextTraings() {
        if (trainings !== undefined) {
            loadTrainings(trainings[trainings.length - 1].id);
        }
    }

    function isAllowLoadNext({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) {
        const triggerBottomDistance = 100;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - triggerBottomDistance;

        return isBottom && !isEnd && isFinishRequest;
    }

    return (
        <>
            {trainings === undefined ?
                <View style={styles.content}>
                    <ActivityIndicator size={100} />
                </View>
                :
                trainings.length == 0 ?
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
                        {trainings.map(elem => <MinPost
                            key={`post ${elem.id}`}
                            training={elem}
                            navigation={props.navigation}
                        />)}
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