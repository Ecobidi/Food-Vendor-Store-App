import React, {useState} from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import {Headline, Paragraph, TextInput, Button, useTheme} from 'react-native-paper'
import { BaseUrl } from '../../utils'
import Axios from 'axios'

const Register = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [surname, setSurname] = useState('')
  const [firstname, setFirstName] = useState('')
  const [error_msg, setErrorMsg] = useState('')
  const {colors} = useTheme()
  const styles = getStyles({colors})

  const handleEmailChange = text => setEmail(text)
  const handlePhoneChange = text => setPhone(text)
  const handlePasswordChange = text => setPassword(text)
  const handleRetypePasswordChange = text => setRetypePassword(text)
  const handleSurnameChange = text => setSurname(text)
  const handleFirstNameChange = text => setFirstName(text)

  const submitForm = async () => {
    if (password !== retypePassword) {
      return setErrorMsg('Passwords do not match!')
    }
    if (!password || !email || !phone || !surname || !firstname || !retypePassword) {
      return setErrorMsg('Fill all the fields')
    }
    try {
      let response = await Axios.post(`${BaseUrl}/customers/register`, {email, phone, surname, first_name: firstname, phone, password, retypePassword})
    
      console.log(response.status + ' ', + response.data)

      if (response.status >= 200 && response.status <= 299) {
        return navigation.navigate('Login')
      } else {
        console.log('Register was not successful')
      }
    } catch (error) {
      console.log(error)
      setErrorMsg('Network Error Occurred!')
    }
    
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingVertical: 24,}}>
        <View style={styles.container}>
        <Headline style={styles.title}>Create Account</Headline>
          <Paragraph style={[styles.error_msg, !error_msg && {display: 'none'}]}>{error_msg}</Paragraph>
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='Email'
            autoCapitalize='none'
            value={email}
            keyboardType='email-address'
            onChangeText={handleEmailChange}
          />
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='Surname'
            autoCapitalize='none'
            value={surname}
            onChangeText={handleSurnameChange}
          />
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='First Name'
            autoCapitalize='none'
            value={firstname}
            onChangeText={handleFirstNameChange}
          />
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='Phone'
            autoCapitalize='none'
            value={phone}
            keyboardType='phone-pad'
            onChangeText={handlePhoneChange}
          />
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='Password'
            secureTextEntry={true}
            autoCapitalize='none'
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TextInput 
            style={styles.textInput}
            mode='outlined'
            label='Retype Password'
            secureTextEntry={true}
            autoCapitalize='none'
            value={retypePassword}
            onChangeText={handleRetypePasswordChange}
          />
          <Button 
            style={styles.btn}
            mode='contained'
            onPress={() => submitForm() }>Sign Up</Button>
          <Button 
            icon='arrow-left' 
            mode='outlined'
            uppercase={false}
            style={styles.backBtn} 
            onPress={() => {navigation.navigate('Login')}}>To Login</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const getStyles = ({colors}) => {
  return (StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      textAlign: 'center',
      fontSize: 20,
      textTransform: 'uppercase',
      marginBottom: 12,
      color: colors.primary,
    },
    textInput: {
      marginVertical: 2,
    },
    btn: {
      marginVertical: 6,
    },
    backBtn: {
      alignSelf: 'center',
      marginTop: 12,
    },
    error_msg: {
      backgroundColor: '#ff2211ff',
      color: 'white',
      textAlign: 'center',
      padding: 6,
      borderRadius: 4,
    }
  })
)
}

export default Register
