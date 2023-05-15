import { StyleProp, TextStyle, ViewStyle } from "react-native";

const defaultStyles: {
    colors: {
        praimaryColor: string,
    },
    title: StyleProp<any>,
    h2:StyleProp<any>,
    normalText: StyleProp<any>,
} = {
    colors: {
        praimaryColor: "#000",//#1589FF
    },
    title: {
        fontWeight: "800",
        fontSize: 30,
        color: "black",
    },
    h2:{
        fontWeight: "800",
        fontSize: 22,
        color: "black",
    },
    normalText: {
        fontSize: 18,
    }
}

export default defaultStyles;
