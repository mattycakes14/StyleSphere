import { Text, View, Button, SafeAreaView } from "react-native";
import Welcome from "../components/Welcome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function Index() {
  return (
    <GestureHandlerRootView>
      <Welcome></Welcome>
    </GestureHandlerRootView>
  );
}
