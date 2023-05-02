# Upgrade React Navigation to v6

Upgrade from 5.x to 6.x following [this guide](https://reactnavigation.org/docs/upgrading-from-5.x#params-are-now-overwritten-on-navigation-instead-of-merging).

### Simple Example

```jsx
// In App.js in a new project

import \* as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
```
