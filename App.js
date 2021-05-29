import React, {useContext, useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Provider as PaperProvider} from 'react-native-paper'
import { observer } from 'mobx-react'
import store, { storeContext } from './src/store'
import Auth from './src/components/auth'
import Main from './src/components/main'
import SplashScreen from './src/components/splashscreen'
import AsyncStorage from '@react-native-community/async-storage'
import Axios from 'axios'
import { BaseUrl } from './src/utils'

const InnerApp = () => {
  let [loading, setLoading] = useState(true)
  let [shouldAuthenticate, setShouldAuthenticate] = useState(false)
  let [user, setUser] = useState(null)

  useEffect(() => {
    console.log('InnerApp UseEffect()')
    verifyAuthentication()
  }, [shouldAuthenticate])

  let cancelAuthentication = async () => {
    store.token = ''
    store.profile = {}
    store.isLoggedIn = false
    // setShouldAuthenticate(true) 
  }

  let verifyAuthentication = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) { return /*setShouldAuthenticate(true) */ }
      const httpConfig = {headers: {
        'authorization': 'Bearer ' + token,
        'content-type': 'application/json'
      }}
      const response = await Axios.get(BaseUrl + '/customers/verifyToken', httpConfig)
      if (response.status === 200) {
        setUser(response.data.user)
        // setShouldAuthenticate(false)
        store.isLoggedIn = true
        store.profile = response.data.user
        store.token = token
        console.log('token verification successful')
      }
    } catch (err) {
      console.log(err)
      // store.isLoggedIn = false
    } finally {
      setLoading(false)
    }
  }
  
  return (
      loading ? (<SplashScreen />) :
      (<NavigationContainer>
        {
          shouldAuthenticate ? <Auth onShouldAuthenticate={setShouldAuthenticate} verifyAuthentication={verifyAuthentication} /> : <Main cancelAuthentication={cancelAuthentication} onShouldAuthenticate={setShouldAuthenticate} user={user} />
        }
      </NavigationContainer>)
  )
}

const App = () => {
  // let [isLoading, setLoading] = useState(false)
  

  // if (isLoading) {
  //   return <SlashScreen />
  // }

  return (
   <storeContext.Provider value={store} >
    <PaperProvider>
      <InnerApp />
    </PaperProvider>
   </storeContext.Provider>
  )
}

export default App
