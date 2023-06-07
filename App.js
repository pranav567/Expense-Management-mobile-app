import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
import LandingScreen from "./screens/landingScreen";
import Register from "./screens/register";
import Login from "./screens/login";
import Home from "./screens/home";
import Profile from "./screens/profile";
import AddExpense from "./screens/addExpense";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpense}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>

      <Toast position="bottom" bottomOffset={20} />
    </>
  );
}
