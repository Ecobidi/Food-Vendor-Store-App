import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const MyActivityIndicator = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator />
    </View>
  )
}

export default MyActivityIndicator