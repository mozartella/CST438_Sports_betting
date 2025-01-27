import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import Button from "@/components/Button";
import AboutScreen from "./about";

const PlaceholderImage = require("@/assets/images/Placeholder.jpg");

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={PlaceholderImage}
          style={styles.image}
          // contain allows image to scale proportionally
          resizeMode="contain"
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Login" />
        <Button label="Create Account" />
      </View>
    </View>
  );
}
/* https://reactnative.dev/docs/image-style-props Link to image manipulations
 https://reactnative.dev/docs/dimensions Link to dimensions for manually scaling images to window ratios*/
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: width * 0.95,
    height: height * 0.5,
    borderRadius: 18,
  },
  footerContainer: {
    /** https://reactnative.dev/docs/flexbox - Explaining Flexbox */
    flex: 1 / 3,
    alignItems: "center",
  },
});
