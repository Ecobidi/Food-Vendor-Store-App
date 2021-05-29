import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Headline, Paragraph, useTheme } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const SplashScreen = () => {
  const { colors } = useTheme()
  const styles = getStyles({colors})

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name='truck' size={86} color={colors.primary} />

      <Headline style={styles.headerTextStyle}>Food Ordering</Headline>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Paragraph>With Love From </Paragraph>
        <MaterialCommunityIcons name='heart' size={24} color='red' />
      </View>
      <Paragraph>Obidi Chukwudi Emmanuel</Paragraph>
    </View>
  )
}

export default SplashScreen

const getStyles = ({colors}) => {
  return (StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerTextStyle: {
      color: colors.primary, 
      paddingHorizontal: 12,
      paddingVertical: 16
    }
  })
  )
}