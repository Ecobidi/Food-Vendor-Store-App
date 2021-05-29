import React from 'react'
import { StyleSheet, View, FlatList, Image } from 'react-native'
import { IconButton, Paragraph, TouchableRipple, useTheme, } from 'react-native-paper'
import { BaseUrl } from '../../utils'

const ItemComponent = ({item, favOperations, styles, colors}) => {
  return (
    <TouchableRipple style={{flex: 1}} >
    <View style={styles.cartItem}>
      <View style={styles.cartItemImageAndDetails}>
        
        <View style={styles.cartItemImageContainer}>
          <Image
            borderRadius={6}
            resizeMode='stretch'
            width='100%'
            height='100%'
            style={styles.cartItemImage}
            source={{uri: BaseUrl + item.primary_image}}
          />
        </View>
        <View style={styles.cartItemDetailsContainer}>
          <Paragraph style={{fontWeight: '700'}}>{item.name}</Paragraph>
        </View>
      </View>
      <View style={styles.cartItemActionsContainer}>
        <View style={styles.removeButtonContainer}>
          <TouchableRipple 
            onPress={() => favOperations.removeFromFavourites(item) }
            style={styles.removeButton}>
            <IconButton icon='trash-can-outline' size={24} color='#cc0000aa' style={{alignSelf: 'center'}} />
          </TouchableRipple>
        </View>
      </View>
    </View>
    </TouchableRipple>
  )
}

const Favourites = ({favourites, favOperations}) => {
  const { colors } = useTheme()
  const styles = getStyles({colors})

  return (
    <FlatList
      data={favourites}
      extraData={[]}
      horizontal={false}
      refreshing={false}
      ItemSeparatorComponent = {() => (<View style={{ backgroundColor: colors.background, paddingVertical: 2 }} />) }
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (<ItemComponent colors={colors} item={item} styles={styles} favOperations={favOperations} />)}
      style={styles.container}
    />
  )
}

export default Favourites

const getStyles = ({colors}) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 14,
      marginTop: 12,
    },
    cartItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    cartItemImageAndDetails: {
      flexDirection: 'row',
    },
    cartItemImageContainer: {
      paddingEnd: 16,
    },
    cartItemImage: {
      width: 60,
      height: 80,
    },
    cartItemDetailsContainer: {
      paddingHorizontal: 4,
      alignSelf: 'flex-start'
    },
    cartItemActionsContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
    },
    removeButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButton: {
      padding: 4,
      borderWidth: 1,
      borderColor: '#cc0000aa',
      width: 26,
      borderRadius: 6,
      marginStart: 10,
      marginEnd: 0,
      marginVertical: 10,
      backgroundColor: 'white',
      alignSelf: 'center',
    }
  })
}
