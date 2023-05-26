import AsyncStorage from '@react-native-async-storage/async-storage';
import Requests from "./request";

export async function requestWithToken(
    req: (accessToken: string) => Promise<Response>,
    goodAction: (res: Response) => void,
    badAction: () => void,
    setUser: (accessToken: string, id: number) => void,
    accessToken: string,
) {
    try {
        let res = await req(accessToken);
        if (res.ok) {
            goodAction(res);
            return;
        } else if (res.status == 403) {
            const refreshData = await checkRefreshToken(setUser);
            console.log(refreshData)

            if (refreshData) {
                res = await req(refreshData.accessToken);
                if (res.ok) {
                    goodAction(res);
                    return;
                }
            }
        } else {
            console.log("Токен мог истеч, а ошибка не 403");
        }
    } catch (error) {
        console.log(error);
    }
    badAction();
}

export default async function checkRefreshToken(setUser: (accessToken: string, id: number) => void) {
    // await AsyncStorage.setItem('refresh_key', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImxvZ2luIjoiYWRtaW4iLCJwYXNzd29yZCI6IiQyYiQxMCRVUGVXc3g4ZEVsaGNwRVp2NXB6Zi8uUzVXSC9HdU5naHlZV1RIS21XRldqV1BTT2t6eGs4LiIsImlhdCI6MTY3NjYzMjcxMH0.55i8W9gSDO-zXMmy62lIQxfiGk8xzLxFDlbUfVhCTl8");
    const refreshKey = await AsyncStorage.getItem('refresh_key');
    if (refreshKey) {
        const response = await Requests.refresh(refreshKey);
        if (response.ok) {
            const data = await response.json();
            AsyncStorage.setItem('refresh_key', data.refreshToken);
            setUser(data.accessToken, data.id)

            return data;
        }
    }

    return false;
}