// import React, {useState} from 'react'
// import {ScrollView, View, StyleSheet, SafeAreaView, Picker} from 'react-native'
// import {TextInput, Headline, Button, Paragraph, useTheme} from 'react-native-paper'
// import Axios from 'axios'
// import AsyncStorage from '@react-native-community/async-storage'
// import { BaseUrl } from '../../utils'

// const DeliveryInfoScreen = ({navigation}) => {
//   const [phone, setPhone] = useState('')
//   const [address, setAddress] = useState('')
//   const [city, setCity] = useState('')
//   const [landmark, setLandmark] = useState('')
//   const [error_msg, setErrorMsg] = useState('')

//   const {colors} = useTheme()
//   const styles = getStyles({colors})

//   const handlePhoneChange = text => setPhone(text)
//   const handleAddressChange = text => setAddress(text)
//   const handleCityChange = text => setCity(text)
//   const handleLandmarkChange = text => setLandmark(text)

//   const submitForm = async () => {
//     if (!password || !email) {
//       return setErrorMsg('Fill all the fields')
//     }
//     try {
//       let response = await Axios.post(`${BaseUrl}/customers/login`, {email, password})
//       console.log(response.status)
//       console.log(response.data)
//       if (response.status >= 200 && response.status <= 299) {
//         await AsyncStorage.setItem('token', response.data.token)
//         verifyAuthentication()
//         setShouldAuthenticate(false)
//       } else {
//         console.log('Register was not successful')
//       }
//     } catch (error) {
//       console.log(error)
//       setErrorMsg('Network Error Occurred!')
//     }
//   }

//   return (
//     <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
//       <ScrollView contentContainerStyle={{paddingVertical: 24,}}>
//         <View style={styles.container}>
//           <Headline>Delivery Information</Headline>

//           <View>
//             <TextInput
//               style={styles.textInput}
//               label='Mobile Phone Number'
//               mode='outlined'
//               value={phone}
//               keyboardType='phone-pad'
//               onChangeText={handlePhoneChange}
//             />

//             <TextInput
//               style={styles.textInput}
//               label='Street Address'
//               mode='outlined'
//               value={address}
//               onChangeText={handleAddressChange}
//             />
      
//             <TextInput
//               style={styles.textInput}
//               label='City'
//               mode='outlined'
//               value={city}
//               onChangeText={handleCityChange}
//             />

//             <TextInput
//               style={styles.textInput}
//               label='Notable Landmark'
//               mode='contained'
//               value={landmark}
//               onChangeText={handleLandmarkChange}
//             />
//           </View>

//           <Headline>Choose Payment Method</Headline>

  
//           <Button 
//             mode='contained' 
//             style={styles.btn}
//             onPress={() => submitForm() }>Login</Button>

//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default DeliveryInfoScreen

// const getStyles = ({colors}) => {
//   return ( StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       paddingHorizontal: 20,
//     },
//     title: {
//       textAlign: 'center',
//       fontSize: 24,
//       fontWeight: '700',
//       textTransform: 'uppercase',
//       marginBottom: 12,
//       color: colors.primary,
//     },
//     textInput: {
//       marginVertical: 6,
//     },
//     btn: {
//       marginVertical: 6,
//       // alignSelf: 'center'
//     },
//     gotoRegister: {
//       alignSelf: 'center',
//       marginTop: 12,
//     },
//     error_msg: {
//       backgroundColor: '#ff2211ff',
//       color: 'white',
//       textAlign: 'center',
//       padding: 6,
//       borderRadius: 4,
//       flex: 1,
//     }
//   })
//   )
// }