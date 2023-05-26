import { DocumentPickerResponse } from "react-native-document-picker";
import { Point } from "./../types";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const domain = "http://169.254.252.193:8000/";
const domain = "http://192.168.1.252:8000/";
// const domain = "http://10.185.231.234:8000/";
// const domain = "http://10.185.233.134:8000/";



class Requests {

    private static async getRequest(url: string, token?: string) {
        const data: RequestInit = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        }
        console.log(domain + url)

        if (token) {
            data.headers!["Authorization"] = 'Bearer ' + token;
        }

        return await fetch(domain + url, data);
    }

    private static async postRequest(url: string, body?: any, token?: string) {
        return await fetch(domain + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(body)
        });
    }

    static async loginReq(login: string, password: string) {
        return await Requests.postRequest("api/auth/login", { login, password });
    }

    static async registerReq(login: string, name: string, surname: string, password: string) {
        return await Requests.postRequest("api/auth/register", { login, name, surname, password });
    }

    static async refresh(refreshKey: string) {
        return await Requests.postRequest("api/auth/refresh", {}, refreshKey);
    }


    // НЕ ВЕРНЫЙ КОД!!!!!!!
    // static async getNews() {
    //     return await Requests.getRequest("news");
    // }

    static async getUsers(search: string, lastId?: number) {
        return await Requests.getRequest(`api/users/list?last_id=${lastId}&search=${search}`);
    }

    static async getFeed(
        userId: number,
        lastId?: number,
    ) {
        return await Requests.getRequest(`api/users/${userId}/feed?last_id=${lastId}`);
    }

    static async getProfileInfo(id: number) {
        return await Requests.getRequest(`api/users/${id}`);
    }

    static async getIsSubscribe(id: number, accessToken: string) {
        return await Requests.getRequest(`api/users/${id}/isSubscribe`, accessToken);
    }

    static async getTraining(id: number) {
        return await Requests.getRequest(`api/trainings/${id}`);
    }

    static async getUserTrainings(
        userId: number,
        lastId?: number,
    ) {
        return await Requests.getRequest(`api/users/${userId}/trainings?last_id=${lastId}`)
    }

    static async finishTraining(points: Point[], accessToken: string) {
        return await Requests.postRequest("api/trainings/add", { points }, accessToken);
    }

    static async getTrainingAnalysis(id: number) {
        return await Requests.getRequest(`api/trainings/${id}/analysis`);
    }

    static async subscribe(userId: number, accessToken: string) {
        return await Requests.postRequest(`api/profile/${userId}/subscribe`, {}, accessToken);
    }

    static async unsubscribe(userId: number, accessToken: string) {
        return await Requests.postRequest(`api/profile/${userId}/unsubscribe`, {}, accessToken);
    }

    static async loadImage(file: DocumentPickerResponse, accessToken: string) {
        let data = new FormData()
        // let reader = new FileReader() 
        // reader.readAsDataURL(file)
        // @ts-ignore
        data.append('avatar', { uri: file.uri, type: file.type!, name: file.name! })
        // data.append('Content-Type', 'image/png');
        return await fetch(domain + `api/profile/change/avatar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: data
        });
    }

    static getAvatar(avatar: string | null) {
        if (avatar) {
            return domain + `img/${avatar}`;
        }
        return domain + 'img/default.png';
    }

    static async changeName(name: string, surname: string, accessToken: string) {
        return await Requests.postRequest(`api/profile/change/name`, { name, surname }, accessToken);
    }

    static async changePassword(oldPassword: string, newPassword: string, accessToken: string) {
        return await Requests.postRequest(`api/profile/change/password`, { oldPassword, newPassword }, accessToken);
    }

}

export default Requests;