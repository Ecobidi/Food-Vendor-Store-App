import React, { useContext ,useEffect, useState, } from 'react'
import { Dimensions, Image, View, ScrollView, StyleSheet } from 'react-native'
import { Avatar, Button, Caption, Paragraph, Searchbar, Subheading, TouchableRipple, useTheme } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ActivityIndicator from '../activityIndicator'
import axios from 'axios'
import { observer } from 'mobx-react'
import { BaseUrl } from '../../utils'
import { storeContext } from '../../store'

const ListItem = ({product, navigation, styles}) => {
  return (
    <TouchableRipple 
      style={styles.listItem}
      onPress={() => {navigation.push('Detail', {item: product})}}>
      <View>
        <View>
          <Image
          style={styles.image}
          resizeMode='stretch'
          source={{uri: BaseUrl + product.primary_image}}
          width='100%'
          height={120} />
          <Caption numberOfLines={1} style={styles.itemVariantLabel}>Medium</Caption>
        </View>
        <View style={styles.cardContent}>
          <Paragraph 
            numberOfLines={2}
            ellipsizeMode='tail'
            style={styles.itemTitle}>{product.name}</Paragraph>
          <Paragraph style={styles.itemPrice}>{'\u20A6'} {Number(product.ProductVariants[0].price).toFixed(2)}</Paragraph>
          {/* <Button 
            icon='cart-outline'
            mode='contained' 
            labelStyle={styles.itemActionLabel}
            onPress={() => {}}>Add</Button> */}
          <Caption 
            numberOfLines={1} 
            ellipsizeMode='tail'>({product.ProductVariants.length} {product.ProductVariants.length > 1 ? 'Variants' : 'Variant'})</Caption>
        </View>
      </View>
    </TouchableRipple>
  )
}

const List = ({navigation, products, styles}) => {

  return (
    <ScrollView horizontal={true} >
      {products.map(item => (<ListItem product={item} navigation={navigation} styles={styles} key={item.name} />) )}
    </ScrollView>
  )
}

const CategoriesGridComponent = ({categories, navigation, style}) => {
  categories = categories.slice(0, categories.length < 5 ? categories.length : 5)
  let items = categories.map(category => (
      <TouchableRipple
        key={category.id.toString()}
        style={style.categoryGridItemWrapper}
        onPress={() => { navigation.push('ProductList', {categoryId: category.id, title: category.name, type: 'category'}) }}>
        <View style={style.categoryGridItem}>  
          <Avatar.Image
            source={{uri: BaseUrl + category.image}}
            size={40} />
          <Paragraph numberOfLines={1} ellipsizeMode='tail' style={style.categoryName}>{category.name}</Paragraph>
        </View>
      </TouchableRipple>
    ))

  items.push((
    <TouchableRipple
      key={'0.00201.003'}
      style={style.categoryGridItemWrapper}
      onPress={() => { navigation.push('CategoryList') }}>
      <View style={style.categoryGridItem}>  
        <Avatar.Icon
          icon='more' size={40} />
        <Paragraph numberOfLines={1} ellipsizeMode='tail' style={style.categoryName}>More</Paragraph>
      </View>
    </TouchableRipple>
  ))

  return (<View style={style.categoriesGrid}>{items}</View>)
}

const getTopCategories = () => axios.get(BaseUrl + '/api/categories/?limit=10000')

const getProducts = (type = '') => axios.get(BaseUrl + '/api/products/?limit=10&type=' + type)

const Home = ({navigation, cartQty}) => {
  const store = useContext(storeContext)
  const { colors } = useTheme()
  const { width } = Dimensions.get('screen')
  const styles = getStyle({colors, width})
  // axios.defaults.headers = {
  //   'Content-Type': 'application/json',
  //   'authorization': 'Bearer ' + store.token
  // }

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState(store.categories.data || [])
  const [featured, setFeatured] = useState(store.products.featured?.data || [])
  const [topSelling, setTopSelling] = useState(store.products.topSelling?.data || [])
  const [trending, setTrending] = useState(store.products.trending?.data || [])
  
  useEffect(() => {
    console.log('useEffect()')
    loadData()
  }, [])

  const updateSearchTerm = (val) => setSearchTerm(val)

  const performSearch = () => {
    if (searchTerm.length > 2) {
      navigation.push('ProductList', {type: 'search', title: 'Search Results', searchTerm})
    }
  }

  const loadData = async () => {
    setLoading(true) // show loading
    try {
      const responses = await axios.all([getTopCategories(), getProducts()])
      setCategories(responses[0].data.data)
      setFeatured(responses[1].data.data)
      setTopSelling(responses[1].data.data)
      setTrending(responses[1].data.data)
      store.categories = responses[0].data // update store categories
      store.products.featured = responses[1].data
      store.products.topSelling = responses[1].data
      store.products.trending = responses[1].data
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false) // hide loading
    }
  }

  return (
    loading ? <ActivityIndicator /> :
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.row}>
          <Searchbar 
            placeholder='What are you looking for?'
            inputStyle={styles.searchBox}
            style={styles.searchBar}
            onChangeText={updateSearchTerm}
            onSubmitEditing={performSearch}
            icon='menu'
            onIconPress={() => {
              navigation.openDrawer()
            }}
             />
          <TouchableRipple 
            onPress={() => navigation.navigate('Cart') }
            style={styles.cartIndicatorWrapper}>
            <View style={styles.cartIndicator}>
              <MaterialCommunityIcons 
                style={styles.cartIcon}
                name='cart-outline' 
                color={colors.surface} 
                size={32} />
              <Paragraph style={styles.cartBadge}>{cartQty}</Paragraph>
            </View>
          </TouchableRipple>
        </View>
        <View style={styles.headerContent}>
          <Paragraph style={styles.headerContentTitle}>Shop By Categories</Paragraph>
          <CategoriesGridComponent categories={categories} navigation={navigation} style={styles} colors={colors} />
        </View>
        
        <View style={styles.body}>
          <View style={styles.section}>
            <View style={styles.subheadingRow}>
              <Subheading style={styles.subheading}>Featured</Subheading>
              <Button 
                style={{width: 'auto'}}
                mode='text'
                uppercase={false}
                onPress={() => { navigation.push('ProductList', {type: 'featured', title: 'Featured'}) }}>View More</Button>
            </View>
            <List products={featured.slice(0, 4)} navigation={navigation} styles={styles} />
          </View>

          <View style={styles.section}>
            <View style={styles.subheadingRow}>
              <Subheading style={styles.subheading}>Top Sellings</Subheading>
              <Button 
                style={{width: 'auto'}}
                mode='text'
                uppercase={false}
                onPress={() => { navigation.push('ProductList', {type: 'topSelling', title: 'Top Sellings'}) }}>View More</Button>
            </View>
            <List products={topSelling.slice(0, 4)} navigation={navigation} styles={styles} />
          </View>

          <View style={styles.section}>
            <View style={styles.subheadingRow}>
              <Subheading style={styles.subheading}>Trending</Subheading>
              <Button 
                style={{width: 'auto'}}
                mode='text'
                uppercase={false}
                onPress={() => { navigation.push('ProductList', {type: 'trending', title: 'Trending'}) }}>View More</Button>
            </View>
            <List products={trending.slice(0, 4)} navigation={navigation} styles={styles} />
          </View>
        </View>
      
      </View>
    </ScrollView>
  )
}

function getStyle({colors, width}){
  return (
    StyleSheet.create({
      scrollViewContainer: {
        flex: 1,
        backgroundColor: colors.background,
      },
      container: {
        flex: 1
      },
      header: {
        width: '100%',
        height: 140,
        position: 'relative',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderBottomLeftRadius: width / 8,
        borderBottomRightRadius: width / 8,
        elevation: 0,
      },
      row: {
        top: -130,
        marginLeft: 12,
        marginRight: 4,
        elevation: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      searchBar: {
        flex: 1,
      },
      searchBox: {
        fontSize: 12,
      },
      // cartIndicatorWrapper: {
      //   width: 58,
      //   height: '100%',
      //   borderRadius: 20,
      //   flexDirection: 'row',
      //   justifyContent: 'flex-end',
      //   // marginRight: 10,
      // },
      // cartIndicator: {
      //   flexDirection: 'row',
      //   alignSelf: 'center',
      // },
      // cartIcon: {
      //   alignSelf: 'center'
      // },
      // cartBadge: {
      //   backgroundColor: colors.accent,
      //   color: colors.surface,
      //   height: 24,
      //   width: 24,
      //   borderRadius: 12,
      //   fontSize: 11,
      //   textAlign: 'center',
      //   textAlignVertical: 'center',
      //   fontWeight: 'bold',
      //   borderWidth: 0,
      //   position: 'absolute',
      //   top: -12,
      //   right: -14,
      // },
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
      headerContent: {
        height: 160,
        width: '85%',
        top: -100,
        paddingTop: 2,
        backgroundColor: colors.surface,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        elevation: 4,
        alignSelf: 'center'
      },
      headerContentTitle: {
        fontSize: 12,
        marginStart: 12,
        marginBottom: 2,
        fontWeight: '700',
        textTransform: 'uppercase',
        color: colors.onSurface,
      },
      body: {
        top: -90,
      },
      categoriesGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
      },
      categoryGridItemWrapper: {
        width: '30%',
        marginBottom: 5,
        borderRadius: 12,
      },
      categoryGridItem: {
        alignItems: 'center'
      },
      categoryImage: {
        height: 40,
        width: 40,
        borderRadius: 6
      },
      categoryName: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.text,
        textTransform: 'capitalize'
      },
      section: {
        marginBottom: 16,
        paddingHorizontal: 12,
      },
      subheadingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      subheading: {
        fontWeight: '700',
      },
      listItem: {
        flex: 1, 
        marginHorizontal: 4,
        minWidth: 140,
        borderRadius: 6,
        backgroundColor: colors.surface,
        paddingBottom: 4,
      },
      image: {
        height: 120,
        margin: 0,
        width: '100%',
      },
      cardContent: {
        alignItems: 'center',
      },
      itemTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text,
        marginTop: 6,
        textTransform: 'capitalize',
      },
      itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: colors.primary,
      },
      itemActionLabel: {
        fontSize: 12
      },
      itemVariantLabel: {
        position: 'absolute',
        top: 2,
        right: 2,
        paddingHorizontal: 2,
        color: colors.surface,
        backgroundColor: colors.text + '77', //'rgba(0, 0, 0, 0.2)',
        borderRadius: 2
      }
    })
  )
}

export default observer(Home)