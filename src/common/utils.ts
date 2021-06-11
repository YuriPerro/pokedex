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

export { width, height, isSmallDevice };
