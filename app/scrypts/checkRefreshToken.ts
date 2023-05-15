import AsyncStorage from '@react-native-async-storage/async-storage';
import Requests from "./request";

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