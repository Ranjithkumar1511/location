import React from "react";
import { Text, View } from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LocationScreen from "./src/Location";

const Stack = createNativeStackNavigator();


const App = ()=> {

 return(
  <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={LocationScreen}
      options={{title: 'Welcome'}}
    />
  </Stack.Navigator>
</NavigationContainer>
 )


}


export default App;