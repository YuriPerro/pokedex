import {
  Platform,
  TouchableOpacity as TouchableOpacityIOS,
  ScrollView as ScrollViewIOS,
  Dimensions,
} from "react-native";

import {
  TouchableOpacity as TouchableOpacityAndroid,
  ScrollView as ScrollViewAndroid,
} from "react-native-gesture-handler";

export const TouchableOpacity =
  Platform.OS === "android" ? TouchableOpacityAndroid : TouchableOpacityIOS;

export const ScrollView = Platform.OS === "android" ? ScrollViewAndroid : ScrollViewIOS;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const isSmallDevice = width < 375;

const getColorByType = (type: string) => {
  switch (type) {
    case "grass":
      return "#48D0B0";
    case "fire":
      return "#FB6C6C";
    case "electric":
      return "#FFD86F";
    case "water":
      return "#76BDFE";
    case "bug":
      return "#86C776";
    case "normal":
      return "#ccc";
    case "poison":
      return "#A74EC6";
    case "ground":
      return "#653F30";
    case "fairy":
      return "#D48792";
    case "fighting":
      return "#b9b9b9";
    case "psychic":
      return "#7B31E2";
    case "rock":
      return "#AB9957";
    case "ghost":
      return "#eee";
    case "ice":
      return "#68D0EE";
    case "dragon":
      return "#28105B";
    case "dark":
      return "#191919";
    case "steel":
      return "#455B6C";
    case "flying":
      return "#C28C4F";
  }
};

export { width, height, isSmallDevice, getColorByType };
