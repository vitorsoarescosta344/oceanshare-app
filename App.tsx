/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './src/utils/yupCustomValidators';
import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createTheme, ThemeProvider} from '@rneui/themed';
import ForgotPassword from './src/screens/ForgotPassword';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {selectIsLoggedIn, setUser} from './src/redux/slices/authSlice';
import {persistedStore, store} from './src/redux/store';
import useLogIn from './src/hooks/useLogin';
import Home from './src/screens/Home';
import Book from './src/screens/Book';
import Books from './src/screens/Books';
import AlterPassword from './src/screens/AlterPassword';
import Details from './src/screens/Details';
import MaintenanceList from './src/screens/MaintenanceList';
import MaintenanceNew from './src/screens/MaintenanceNew';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal} from 'react-native-onesignal';
import api from './src/services/api';

const Stack = createNativeStackNavigator();

function UnloggedNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(null));
  }, [dispatch]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="AlterPassword" component={AlterPassword} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const isLogged = useSelector(selectIsLoggedIn);

  const signIn = useLogIn();

  if (!isLogged) {
    return <UnloggedNavigator />;
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="MaintenanceList" component={MaintenanceList} />
      <Stack.Screen name="MaintenanceNew" component={MaintenanceNew} />
      <Stack.Screen name="Book" component={Book} />
      <Stack.Screen name="Books" component={Books} />

      <Stack.Screen name="AlterPassword" component={AlterPassword} />
    </Stack.Navigator>
  );
}

const theme = createTheme({
  components: {
    Button: {
      containerStyle: {
        marginVertical: 10,
        borderRadius: 5,
      },
    },
  },
  lightColors: {
    primary: '#8ccccc',
    secondary: '#000',
  },
});

function App(): JSX.Element {
  OneSignal.initialize('5fe1017e-d1df-4db7-9b8b-b88d3132473b');
  OneSignal.Notifications.requestPermission(true);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
