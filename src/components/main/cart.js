import React, {useContext, useState} from 'react'
import { Alert, StyleSheet, View, FlatList, Image, Dimensions, } from 'react-native'
import { Caption, IconButton, Paragraph, TouchableRipple, useTheme, Button, Portal, Modal, } from 'react-native-paper'
import { observer } from 'mobx-react'
import { storeContext } from '../../store'
import { BaseUrl } from '../../utils'

const CartFooterComponent = ({cart, styles, isLoggedIn, store, openModal}) => {
  let totalPrice = 0
  cart.forEach(i => totalPrice += (i.qty * i.variant.price))

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      return openModal()
    }
    // console.log(cart)
    // let myCart = cart.map(c => ({product_id: c.id, quantity: c.qty, product_variant: c.variant.size, total_price: c.qty * c.variant.price, customer_id: store.profile.id}))
    Alert.alert('This application is still in undergoing development')
  }

  return (
    <View style={styles.footerContainer}>
      <Paragraph>Total:  {'\u20A6'} {totalPrice.toFixed(2)}</Paragraph>
      <Button 
        color='white'
        uppercase={false}
        style={styles.button} 
        onPress={() => handleCheckout() }>Checkout  >></Button>
    </View>
  )
}

const CartItemComponent = ({item, cartOperations, styles, colors}) => {
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
          <Caption>{item.variant.size} ({'\u20A6'}{item.variant.price})</Caption>
          <Paragraph style={styles.cartItemPrice}>{'\u20A6'} {item.variant.price * item.qty}</Paragraph>
        </View>
      </View>
      <View style={styles.cartItemActionsContainer}>
        <View style={styles.cartItemQtyChangeContainer}>
          <IconButton icon='plus' size={14} color={colors.text} style={styles.cartItemQtyUpdateButton} onPress={() => cartOperations.incrementItemQty(item) } />
          <Paragraph style={styles.cartItemQty}>{item.qty}</Paragraph>
          <IconButton icon='minus' size={14} color={colors.text} style={styles.cartItemQtyUpdateButton} onPress={() => cartOperations.decrementItemQty(item) }/>
        </View>
        <View style={styles.removeButtonContainer}>
          <TouchableRipple 
            onPress={() => cartOperations.removeFromCart(item) }
            style={styles.removeButton}>
            <IconButton icon='trash-can-outline' size={24} color='#cc0000aa' style={{alignSelf: 'center'}} />
          </TouchableRipple>
        </View>
      </View>
    </View>
    </TouchableRipple>
  )
}

const Cart = ({cart, cartOperations, setShouldAuthenticate}) => {
  const { colors } = useTheme()
  const { height } = Dimensions.get('window')
  const styles = getStyles({colors, height})
  const store = useContext(storeContext)

  const [modalVisible, setModalVisible] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  return (
    <>
    { modalVisible && (
      <Portal>
      <Modal 
        contentContainerStyle={styles.modal}
        dismissable={true}
        visible={modalVisible}
        onDismiss={() => closeModal() }
      >
        <View>
          <Paragraph style={{marginBottom: 20, fontWeight: 'bold'}}>You must be logged in to checkout</Paragraph>
          <Button
            uppercase={false}
            color='#fff'
            style={styles.button}
            onPress={() => setShouldAuthenticate(true) }
            >Proceed to Login  >></Button>
        </View>
      </Modal>
      </Portal>
      ) 
    }
    <FlatList
      data={cart}
      extraData={[]}
      horizontal={false}
      refreshing={false}
      ItemSeparatorComponent = {() => (<View style={{ backgroundColor: colors.background, paddingVertical: 2 }} />) }
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (<CartItemComponent colors={colors} item={item} styles={styles} cartOperations={cartOperations} />)}
      ListFooterComponent = { () => (<CartFooterComponent cart={cart} styles={styles} openModal={openModal} isLoggedIn={store.isLoggedIn} store={store} />) }
      style={styles.container}
    />
    </>
  )
}

export default observer(Cart)

const getStyles = ({ colors, height, }) => {
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
      flexDirection: 'row',
      alignItems: 'center',
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
    cartItemQtyChangeContainer: {
      justifyContent: 'space-between',
      marginHorizontal: 6,
    },
    cartItemQty: {
      backgroundColor: colors.primary,
      paddingVertical: 4,
      fontSize: 12,
      borderRadius: 6,
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    cartItemQtyUpdateButton: {
      fontWeight: 'bold',
    },
    cartItemPrice: {
      color: colors.primary,
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
      alignSelf: 'center'
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.primary + '44',
      marginTop: 24,
      marginBottom: 12,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    button: {
      backgroundColor: colors.primary,
      color: 'white',
    },
    modal: {
      backgroundColor: colors.surface,
      marginHorizontal: 24,
      padding: 24,
      alignItems: 'center',
      borderRadius: 6,
      height: height / 4,
    }
  })
}
