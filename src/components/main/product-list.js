import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Image } from 'react-native'
import { ActivityIndicator, Caption, IconButton, Paragraph, TouchableRipple, useTheme } from 'react-native-paper'
import axios from 'axios'
import { observer } from 'mobx-react'
// import { storeContext } from '../../store'
import { BaseUrl } from '../../utils'

const ListHeader = ({numberOfItems = 0, styles, loading }) => {
  if (loading) return (
    <View style={{alignItems: 'center', paddingTop: 4,}}>
      <ActivityIndicator color='white' style={styles.listHeaderRowActivityIndicator} />
    </View>
  )
  return (
    <View style={styles.listHeaderRow}>
      <Paragraph>{numberOfItems} Products Found</Paragraph>
      <IconButton icon='sort' size={24} 
        onPress={() => {}} />
    </View>
  )
}

const ListItem = ({product, navigation, styles}) => {
  return (
    <TouchableRipple 
      style={styles.listItem}
      onPress={() => {navigation.push('Detail', {item: product})}}>
      <View>
        <View>
        <Image
          style={styles.image}
          resizeMode='contain'
          source={{uri: BaseUrl + product.primary_image}}
          width='100%'
          height={120} />
          <Caption numberOfLines={1} style={styles.itemVariantLabel}>{product.ProductVariants[0].size}</Caption>
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

const ProductList = ({navigation, route}) => {
  // const store = useContext(storeContext)
  const { colors } = useTheme()
  const styles = getStyles({colors})

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    route.params.title && navigation.setOptions({title: route.params.title})
    let type = route.params.type
    console.log(type)
    let url = BaseUrl + '/api/products/'

    switch(type) {
      case 'search': {
        url += `?search=${route.params.searchTerm}`
        break
      }
      case 'category': {
        url += `?category=${route.params.categoryId}`
        break
      }
      default: {
        url += `?type=${route.params.type}`
      }
    }
    setDataUrl(url)
    // store.products[type] && setProducts(store.products[type].data)
    // loadData()
    if (dataUrl) {
      loadData()
    }
  }, [dataUrl])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(dataUrl)
      setProducts(response.data.data)
      // store.products[type] = response.data // update store
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlatList 
      style={styles.container}
      horizontal={false}
      numColumns={2}
      data={products}
      extraData={[]}
      refreshing={false}
      onRefresh={() => { loadData() }}
      keyExtractor={(item) => (item.name.toString())}
      ListHeaderComponent={() => (<ListHeader loading={loading} numberOfItems={products.length} styles={styles} />) }
      renderItem={({item}) => (<ListItem product={item} navigation={navigation} styles={styles} />)}
    />
  )
}

function getStyles({colors}) {
  return (
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background
      },
      listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        marginBottom: 8,
      },
      listHeaderRowActivityIndicator: {
        backgroundColor: colors.primary,
        padding: 6,
        borderRadius: 25,
      },
      listItem: {
        flex: 1, 
        maxWidth: '50%',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 6,
        backgroundColor: colors.surface,
        padding: 0,
      },
      image: {
        height: 120,
        margin: 0,
        width: '100%',
        backgroundColor: colors.surface,
      },
      cardContent: {
        alignItems: 'center',
      },
      itemTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
        marginTop: 6,
        textTransform: 'capitalize',
      },
      itemPrice: {
        fontSize: 15,
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
        textTransform: 'lowercase',
        color: colors.surface,
        backgroundColor: colors.text + '77', //'rgba(0, 0, 0, 0.2)',
        borderRadius: 2
      }
    })
  )
}

export default observer(ProductList)
