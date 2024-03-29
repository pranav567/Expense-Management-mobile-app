import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import { Provider } from "react-redux";
import store from "./store";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
import LandingScreen from "./screens/landingScreen";
import Register from "./screens/register";
import Login from "./screens/login";
import Home from "./screens/home";
import Profile from "./screens/profile";
import AddTransaction from "./screens/addTransaction";
import AllTransactions from "./screens/allTransactions";
import TestDetails from "./screens/testDetails";
import RecurringTransactions from "./screens/recurringTransactions";

export default function App() {
  return (
    // <StatusBar />
    <Provider store={store}>
      <Toast position="top" topOffset={20} />

      <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="TestDetails"
            component={TestDetails}
            // options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="All Transactions"
            component={AllTransactions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransaction}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecurringTransactions"
            component={RecurringTransactions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
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
    </Provider>
  );
}
