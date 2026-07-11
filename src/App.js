import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import BerandaScreen from './src/screens/BerandaScreen';
import { getData, STORAGE_KEYS } from './src/utils/storage';

const Stack = createStackNavigator();

const App = () => {
    const [initialRoute, setInitialRoute] = useState('SignUp');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const isLoggedIn = await getData(STORAGE_KEYS.IS_LOGGED_IN);
        if (isLoggedIn) {
            setInitialRoute('Beranda');
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="Beranda" component={BerandaScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;