import React, {useState} from 'react'
import {ScrollView, View, StyleSheet, SafeAreaView} from 'react-native'
import {TextInput, Headline, Button, Paragraph, IconButton, useTheme} from 'react-native-paper'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { BaseUrl } from '../../utils'

const Login = ({navigation, setShouldAuthenticate, verifyAuthentication}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error_msg, setErrorMsg] = useState('')

  const {colors} = useTheme()
  const styles = getStyles({colors})

  const handleEmailChange = text => setEmail(text)
  const handlePasswordChange = text => setPassword(text)

  const submitForm = async () => {
    if (!password || !email) {
      return setErrorMsg('Fill all the fields')
    }
    try {
      let response = await Axios.post(`${BaseUrl}/customers/login`, {email, password})
      console.log(response.status)
      console.log(response.data)
      if (response.status >= 200 && response.status <= 299) {
        await AsyncStorage.setItem('token', response.data.token)
        verifyAuthentication()
        setShouldAuthenticate(false)
      } else {
        console.log('Register was not successful')
      }
    } catch (error) {
      console.log(error)
      setErrorMsg('Network Error Occurred!')
    }
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView contentContainerStyle={{paddingVertical: 24,}}>
        <View style={styles.container}>
          <Headline style={styles.title}>Login</Headline>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Paragraph style={[styles.error_msg, !error_msg && {display: 'none'}]}>{error_msg}</Paragraph>
            <IconButton icon='cancel' color='red' size={24} style={[!error_msg && {display: 'none'}]} onPress={() => setErrorMsg('') } />
          </View>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            label='Email'
            mode='outlined'
            autoCapitalize='none'
            keyboardType='email-address'
            value={email}
            onChangeText={handleEmailChange}
           />
    
           <TextInput
            style={styles.textInput}
            label='Password'
            mode='outlined'
            secureTextEntry={true}
            value={password}
            onChangeText={handlePasswordChange}
           />
  
          <Button 
            mode='contained' 
            style={styles.btn}
            onPress={() => submitForm() }>Login</Button>
          
          <View>
            <Button 
              uppercase={false}
              mode='outlined'
              style={styles.gotoRegister}
              onPress={() => {navigation.navigate('Register')}}>Not Yet Registered?</Button>

            <Button
              style={{marginTop: 24, alignSelf: 'center'}}
              uppercase={false}
              mode='contained'
              onPress={() => setShouldAuthenticate(false) }>Back to App</Button>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login

const getStyles = ({colors}) => {
  return ( StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 12,
      color: colors.primary,
    },
    textInput: {
      marginVertical: 6,
    },
    btn: {
      marginVertical: 6,
      // alignSelf: 'center'
    },
    gotoRegister: {
      alignSelf: 'center',
      marginTop: 12,
    },
    error_msg: {
      backgroundColor: '#ff2211ff',
      color: 'white',
      textAlign: 'center',
      padding: 6,
      borderRadius: 4,
      flex: 1,
    }
  })
  )
}