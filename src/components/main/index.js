import React, { useContext, useEffect, useState } from 'react'
import { View, StatusBar, SafeAreaView, StyleSheet, } from 'react-native'
import {createDrawerNavigator, DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-community/async-storage'
import {createStackNavigator} from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Appbar, Avatar, Paragraph, Headline, TouchableRipple, useTheme, HelperText} from 'react-native-paper'
import { observer } from 'mobx-react'

import { storeContext } from '../../store'

import Cart from './cart'
import CategoryList from './category-list'
import CategoryProductList from './category-product-list'
import Detail from './detail'
import Favourites from './favourites'
import Home from './home'
import ProductList from './product-list'

const Drawer = createDrawerNavigator()

const MainStack = createStackNavigator()

const DrawerContent = ({navigation, store, cancelAuthentication, setShouldAuthenticate}) => {
  const {colors} = useTheme()
  const styles = getStyles({colors})
  
  const logout = async () => {
    await AsyncStorage.setItem('token', '')
    cancelAuthentication()
    setShouldAuthenticate(true)
  }
  
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={{flex: 1}}>
        <DrawerContentScrollView>
          <View style={styles.drawerContent}>
            <View style={styles.drawerContentHeader}>
              <MaterialCommunityIcons name='truck' size={65} color={colors.primary} />
              <Headline style={{color: colors.primary, paddingHorizontal: 12,}}>Food Ordering</Headline>
            </View>
        
            <View style={styles.drawerContentSection}>
              <HelperText style={styles.drawerContentSectionTitle}>My Account</HelperText>
              
              { store.isLoggedIn && (<DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='account' size={size} color={color} />) }
                label='My Profile'
                onPress={() => {}}
              />)
              }
              <DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='heart' size={size} color={color} />) }
                label='My Favourites'
                onPress={() => navigation.navigate('Favourites') }
              />
              <DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='cart' size={size} color={color} />) }
                label='My Cart'
                onPress={() => navigation.navigate('Cart') }
              />
              { store.isLoggedIn && (<DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='truck' size={size} color={color} />) }
                label='My Orders'
                onPress={() => {}}
              />)
              }
              { store.isLoggedIn && (<DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='logout' size={size} color={color} />) }
                label='Logout'
                onPress={() => logout() }
              />)
              }
            </View>
            
            { !store.isLoggedIn && (<View style={styles.drawerContentSection}>
              <HelperText style={styles.drawerContentSectionTitle}>Authentication</HelperText>
              <DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='login' size={size} color={color} />) }
                label='Login / Register'
                onPress={() => setShouldAuthenticate(true)}
              />
            </View>)
          }
            <View style={styles.drawerContentSection}>
              <HelperText style={styles.drawerContentSectionTitle}>Support</HelperText>
              <DrawerItem
                icon={ ({focused, size, color}) => (<MaterialCommunityIcons name='web' size={size} color={color} />) }
                label='About'
                onPress={() => {}}
              />
            </View>
            
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </>
  )
}

const Header = ({ cartQty, scene, previous, navigation }) => {
  const {colors} = useTheme()
  const styles = getStyles({colors})
  const { options } = scene.descriptor
  const title = options.headerTitle ? options.headerTitle : options.title
  // return (
  //   <Appbar.Header>
  //     {previous ? 
  //       (<Appbar.BackAction onPress={navigation.goBack} />) 
  //       :
  //       (<TouchableRipple
  //           onPress={navigation.openDrawer}>
  //           <MaterialCommunityIcons name='menu' color={colors.surface} size={26} />
  //         </TouchableRipple>)
  //     }
  //     <Appbar.Content
  //       style={{justifyContent: 'center', alignItems: 'center'}}
  //       title={previous ? 
  //         <Paragraph style={styles.title}>{title}</Paragraph> :
  //         <View style={styles.row}>
  //           <Avatar.Text label='F' size={30} style={{backgroundColor: colors.surface}} labelStyle={{color: colors.primary, fontWeight: 'bold'}} />
  //           <Paragraph style={styles.title}>{title}</Paragraph>
  //         </View>
  //       }
        
  //      />
  //     <Appbar.Action icon='cart-outline' onPress={() => {}} color={colors.surface} />
      
  //   </Appbar.Header>
  // )
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {previous ? 
          (<Appbar.BackAction onPress={navigation.goBack} color={colors.surface} />) 
          :
          (<TouchableRipple
            onPress={navigation.openDrawer}>
            <MaterialCommunityIcons name='menu' color={colors.surface} size={26} />
          </TouchableRipple>)
        }
      </View>

      <View style={styles.headerCenter}>
        { previous ? 
          <Paragraph style={styles.title}>{title}</Paragraph> :
          <View style={styles.row}>
            <Avatar.Text label='F' size={30} style={{backgroundColor: colors.surface}} labelStyle={{color: colors.primary, fontWeight: 'bold'}} />
            <Paragraph style={styles.title}>{title}</Paragraph>
          </View>
        }
      </View>

      <View style={styles.headerRight}>
        <TouchableRipple 
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartIndicatorWrapper}>
          <View style={styles.cartIndicator}>
            <MaterialCommunityIcons 
              style={styles.cartIcon}
              name='cart-outline' 
              color={colors.surface} 
              size={24} />
            <Paragraph style={styles.cartBadge}>{cartQty}</Paragraph>
          </View>
        </TouchableRipple>
      </View>
    </View>
  )
}

const MainStackScreen = ({setShouldAuthenticate}) => {
  const [cart, setCart] = useState([])
  const [cartQty, setCartQty] = useState(0)
  const [favourites, setFavourites] = useState([])
  // const [savedCart, setSavedCart] = useState([])
  const [cartLoadedFromAsyncStorage, setCartLoadedFromAsyncStorage] = useState(false)

  useEffect(() => {
    if (!cartLoadedFromAsyncStorage) { 
      // load for async storage on initial render
      loadFromAsyncStorage()
    }
    // updates cartQty for both initial and subsequent cart operations
    let qty = 0
    cart.forEach(p => qty += p.qty)
    setCartQty(qty)
  }, [cart, favourites])

  const loadFromAsyncStorage = async () => {
    try {
      let [[cartKey, savedCart], [favsKey, savedFavs]] = await AsyncStorage.multiGet(['cart', 'favourites'])
      if (savedCart) {
        await setCart(JSON.parse(savedCart))
        setCartLoadedFromAsyncStorage(true)
      }
      if (savedFavs) {
        await setFavourites(JSON.parse(savedFavs))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const cartOperations = {
    addToCart(product) {
      let newCart = cart.concat([])
      let index = newCart.findIndex(i => i.id == product.id)
      if (index == -1) { // item not already in cart
        newCart.push({ ...product, qty: 1 })
        setCart(newCart)
        this._updateAsyncStorage(newCart)
      }
    },
    removeFromCart(product) {
      let newCart = cart.concat([])
      let index = newCart.findIndex(i => i.id == product.id)
      if (index != -1) {
        newCart.splice(index, 1)
        setCart(newCart)
        this._updateAsyncStorage(newCart)
      }
    },
    incrementItemQty(product) {
      let newCart = cart.concat([])
      let index = newCart.findIndex(i => i.id == product.id)
      if (index == -1) { // item not already in cart
        this.addToCart(product)
      } else { // increment item qty
        newCart[index].qty ++
      }
      setCart(newCart)
      this._updateAsyncStorage(newCart)
    },
    decrementItemQty(product) {
      let newCart = cart.concat([])
      let index = newCart.findIndex(i => i.id == product.id)
      if (index != -1) {
        if (newCart[index].qty > 1) newCart[index].qty --
        else return this.removeFromCart(product)
      }
      setCart(newCart)
      this._updateAsyncStorage(newCart)
    },
    _updateAsyncStorage(cart) {
      // save to AsyncStorage
      AsyncStorage.setItem('cart', JSON.stringify(cart), (err) => { 
        err && console.log(err) 
      })
    },
  }

  const favouriteOperations = {
    addToFavourites(product) {
      let newFav = favourites.concat([])
      let index = newFav.findIndex(i => i.id == product.id)
      if (index == -1) {
        newFav.push(product)
        setFavourites(newFav)
        this._updateAsyncStorage(newFav)
      }
    },
    removeFromFavourites(product) {
      let newFav = favourites.concat([])
      let index = newFav.findIndex(i => i.id == product.id)
      if (index != -1) {
        newFav.splice(index, 1)
        setFavourites(newFav)
        this._updateAsyncStorage(newFav)
      }
    },
    _updateAsyncStorage(favourites) {
      // save to AsyncStorage
      AsyncStorage.setItem('favourites', JSON.stringify(favourites), (err) => { 
        err && console.log(err) 
      })
    },
  }

  return (
    <MainStack.Navigator screenOptions={{
      header: ({scene, previous, navigation}) => (<Header scene={scene} previous={previous} navigation={navigation} cartQty={cartQty} />) }}>

      <MainStack.Screen name='Home' options={{headerShown: false}}>
        {(props) => <Home {...props} cartQty={cartQty} /> }
      </MainStack.Screen>

      <MainStack.Screen name='Detail' options={{title: '', headerTitle: ''}}>
        {(props) => <Detail {...props} cartOperations={cartOperations} favouriteOperations={favouriteOperations} /> }
      </MainStack.Screen>

      <MainStack.Screen name='Cart' options={{title: 'Cart', headerTitle: ''}}>
        {(props) => <Cart {...props} cart={cart} cartOperations={cartOperations} setShouldAuthenticate={setShouldAuthenticate} /> }
      </MainStack.Screen>

      <MainStack.Screen name='Favourites' options={{title: 'Favourites', headerTitle: ''}}>
        {(props) => <Favourites {...props} favourites={favourites} favOperations={favouriteOperations} /> }
      </MainStack.Screen>

      <MainStack.Screen name='CategoryList' component={CategoryList} options={{title: 'Categories'}} />

      <MainStack.Screen name='ProductList' component={ProductList} options={{title: 'Products'}} />

      <MainStack.Screen name='CategoryProductList' component={CategoryProductList} options={{title: 'Products'}} />



    </MainStack.Navigator>
  )
}

const Main = ({onShouldAuthenticate, cancelAuthentication}) => {
  const { colors } = useTheme()
  const store = useContext(storeContext)

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary + 'cc'} />
      <Drawer.Navigator openByDefault={false} drawerContent={({navigation}) => (<DrawerContent store={store} navigation={navigation} setShouldAuthenticate={onShouldAuthenticate} cancelAuthentication={cancelAuthentication} />)}>
        <Drawer.Screen name='Main'>
          { (props) => <MainStackScreen {...props} setShouldAuthenticate={onShouldAuthenticate} /> }
        </Drawer.Screen>
      </Drawer.Navigator>
    </>
  )
}

function getStyles({colors, DEFAULT_APPBAR_HEIGHT = 56 }) {
  return (StyleSheet.create({
    drawerContent: {
      flex: 1
    },
    drawerContentHeader: {
      width: '100%', 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
      paddingVertical: 30, 
      borderBottomWidth: 2, 
      borderBottomColor: colors.primary
    },
    drawerContentSection: {
      flex: 1,
      paddingVertical: 18,
    },
    drawerContentSectionTitle: {
      color: colors.backdrop,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
      marginHorizontal: 6,
      textTransform: 'capitalize',
    },
    header: {
      height: DEFAULT_APPBAR_HEIGHT,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    headerCenter: {
      flexDirection: 'row',
    },
    headerRight: {
    },
    cartIndicatorWrapper: {
      height: '100%',
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 12,
    },
    cartIndicator: {
      flexDirection: 'column',
      alignSelf: 'center',
      top: 6,
      // justifyContent: 'space-between'
    },
    cartIcon: {

      // alignSelf: 'flex-end'
    },
    cartBadge: {
      alignSelf: 'flex-end',
      top: -6,
      // backgroundColor: colors.accent,
      color: colors.surface,
      
      borderRadius: 12,
      paddingHorizontal: 3,
      fontSize: 12,
      // fontFamily: 'monospace',
      // textAlign: 'center',
      fontWeight: 'bold',
      textAlignVertical: 'bottom',
      borderWidth: 0,
      // position: 'absolute',
      // bottom: -14,
      // right: -14,
    },
  }))
}

export default observer(Main)
