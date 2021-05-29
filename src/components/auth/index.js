import React from 'react'
import {StatusBar} from 'react-native'
// import {useTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {useTheme} from 'react-native-paper'
import Login from './login'
import Register from './register'
import ForgotPassword from './forgot-password'

const Stack = createStackNavigator()

const Auth = ({onShouldAuthenticate, verifyAuthentication}) => {
  const {colors} = useTheme()

  return (
    <>
      <StatusBar backgroundColor={colors.primary} />
      <Stack.Navigator initialRouteName='Login' headerMode='none'>
        <Stack.Screen name='Login'>
          { (props) => <Login {...props} setShouldAuthenticate={onShouldAuthenticate} verifyAuthentication={verifyAuthentication} /> }
        </Stack.Screen>
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      </Stack.Navigator>
    </>
  )
}

export default Auth
