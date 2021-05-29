import React, { useEffect, useRef, useState } from 'react'
import { View, Image, ScrollView, StyleSheet, } from 'react-native'
import { Button, IconButton, Paragraph, Headline, Subheading, TouchableRipple, useTheme } from 'react-native-paper'
import ViewPager from '@react-native-community/viewpager'
import { observer } from 'mobx-react'
import { BaseUrl } from '../../utils'

const Detail = ({navigation, route, cartOperations, favouriteOperations}) => {
  const {colors} = useTheme()
  const styles = getStyle({colors})  
  const [position, setPosition] = useState(0)
  const [product, setProduct] = useState(route.params.item)
  const [variant, setVariant] = useState(route.params.item.ProductVariants[0])
  const viewPagerRef = useRef(null)

  const slideImages = () => {
    let childPagers = viewPagerRef.current.props.children
    let numberOfChildPagers = childPagers.length
    let numberOfImages = numberOfChildPagers > 0 && typeof childPagers[numberOfChildPagers - 1] != 'boolean' ? numberOfChildPagers : numberOfChildPagers - 1
    
    let timerId

    viewPagerRef.current.setPage(position)

    if (numberOfImages > 1) {
      if (true) {
        timerId = setTimeout(() => {
          setPosition(position < numberOfImages - 1 ? position + 1 : 0)
        }, 5000)
      }
    }

    // console.log('current image slide = ' + position)

    return timerId
  }
  
  useEffect(() => {
    navigation.setOptions({ title: route.params.item.name })
    setProduct(route.params.item)
    let timerId = slideImages()
    return () => { clearTimeout(timerId) }
  }, [position])

  const handleVariantChange = variant => { setVariant(variant) }

  const addToCart = () => {
    console.log('addToCart called')
    let {id, name, primary_image} = product
    let cartProduct = {id, name, primary_image, variant}
    cartOperations.addToCart(cartProduct)
  }

  const addToFavourites = () => {
    console.log('addToFavourites called')
    let favItem = {id, name, primary_image} = product
    favouriteOperations.addToFavourites(favItem)
  }

  return (
    <ScrollView> 
      <View style={styles.container}>
        <View style={styles.top}>
          <ViewPager 
            ref={viewPagerRef}
            style={styles.viewPager}
            initialPage={0}
            orientation='horizontal'
            transitionStyle='scroll'
            showPageIndicator={true}
            onPageSelected={evt => { /* setPosition(evt.nativeEvent.position) */ }}>
            
            <View style={{flex: 1}} key={product.primary_image}>
              <Image 
                style={styles.viewPagerImage}
                resizeMode='contain'
                width='100%'
                source={{uri: BaseUrl + product.primary_image}} />
            </View>
            <View style={{flex: 1}} key='x32dkse234'>
              <Image 
                style={styles.viewPagerImage}
                resizeMode='contain'
                width='100%'
                source={require('../../assets/default-image.png')} />
            </View>
            {
              product.ProductImages.length > 0 && product.ProductImages.map(image => (
                <View style={{flex: 1}} key={image.filename}>
                  <Image 
                    style={styles.viewPagerImage}
                    resizeMode='contain'
                    width='100%'
                    source={{uri: BaseUrl + image.filename}} />
                </View>
              ))
            }
            
          </ViewPager>
          <View style={styles.viewPagerIndicator}>
            <View style={[styles.dot, {backgroundColor: position == 0 ? colors.accent : '#cacaca'}]} />
            <View style={[styles.dot, {backgroundColor: position == 1 ? colors.accent : '#cacaca'}]} />
            {
              product.ProductImages.map((item, index) => (
                <View key={index.toString()} style={ [styles.dot, {backgroundColor: position == (index + 1) ? colors.accent : '#cacaca'}] } />
              ))
            }
          </View>
          <TouchableRipple
            style={styles.favorite}>
            <IconButton 
              onPress={addToFavourites}
              icon='heart-outline' 
              color={colors.primary}
              size={32} />
          </TouchableRipple>
        </View>
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Subheading style={styles.name}>{product.name} - </Subheading>
            <Paragraph>{variant.size}</Paragraph>
          </View>
          <View style={styles.priceRow}>
            <Headline style={styles.price}>{'\u20A6'} { Number(variant.price).toFixed(2) }</Headline>
            <Button
              style={styles.cartAction}
              icon='cart-outline'
              mode='contained'
              onPress={addToCart}>Add To Cart</Button>
          </View>
        </View>

        <View style={styles.variantsWrapper}>
          {
            product.ProductVariants.map(v => (
              <TouchableRipple
                key={v.id.toString()}
                onPress={() => { handleVariantChange(v) }} 
                style={[styles.variantsAction, (v.size == variant.size) && styles.variantActionActive]}>
                <View>
                  <Subheading style={[styles.variantPrice, styles.variantPriceActive]}>${Number(v.price).toFixed(2)}</Subheading>
                  <Paragraph style={[styles.variantName, styles.variantNameActive]}>{v.size}</Paragraph>
                </View>
              </TouchableRipple>
            ))
          }
        </View>
      
        <View style={styles.descriptionWraper}>
          <Subheading style={styles.descriptionTitle}>Description:</Subheading>
          <Paragraph 
            style={styles.descriptionBody}
            ellipsizeMode='tail'
            numberOfLines={25}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nisi culpa dicta voluptate molestias facere perferendis recusandae, praesentium cumque aperiam.
            </Paragraph>
        </View>

      </View>
    </ScrollView>
  )
}

function getStyle({colors}) {
  return (
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#ccc',
      },
      top: {
        backgroundColor: colors.surface,
      },
      viewPager: {
        height: 250,
        width: '100%',
      },
      viewPagerImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.surface,
      },
      favorite: {
        position: 'absolute',
        bottom: 0,
        right: 12,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#efefef',
      },
      viewPagerIndicator: {
        width: '100%',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dot: {
        height: 6,
        width: 6,
        borderRadius: 3,
        marginHorizontal: 4,
        backgroundColor: '#cacaca',
      },
      content: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingBottom: 12,
      },
      name: {
        textTransform: 'capitalize',
      },
      nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
      },
      priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      },
      variantsWrapper: {
        flexDirection: 'row',
        paddingVertical: 6,
        backgroundColor: '#bfbfbf',
        elevation: 4,
      },
      variantsAction: {
        flex: 1,
        maxWidth: '50%',
        paddingVertical: 4,
        backgroundColor: colors.surface,
        borderColor: '#cecece',
        borderWidth: StyleSheet.hairlineWidth,
      },
      variantPrice: {
        fontSize: 18,
        textAlign: 'center'
      },
      variantName: {
        fontSize: 14,
        textAlign: 'center'
      },
      variantActionActive: {
        backgroundColor: '#efefef',
      },
      variantPriceActive: {
        color: colors.accent,
      },
      variantNameActive: {
        color: colors.accent,
      },
      descriptionWraper: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 12,
      },
      descriptionTitle: {
        fontWeight: '700',
        // color: colors.text,
      },
      descriptionBody: {
        // color: colors.text, 
        textAlign: 'justify',
      }
    })
  )
}

export default observer(Detail)
