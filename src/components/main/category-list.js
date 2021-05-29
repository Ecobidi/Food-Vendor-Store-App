import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, View, StyleSheet } from 'react-native'
import { Paragraph, TouchableRipple, useTheme } from 'react-native-paper'
import axios from 'axios'
import { observer } from 'mobx-react'
import { storeContext } from '../../store'
import { BaseUrl } from '../../utils'

const ListItem = ({category, navigation, styles}) => {
  return (
    <TouchableRipple
      style={styles.listItem}
      onPress={ () => { navigation.push('ProductList', {categoryId: category.id, title: category.name, type: 'category'}) }}>
      <View style={styles.categoryItem}>
        <Image 
          style={styles.categoryImage}
          source={{uri: BaseUrl + category.image}} 
          width={'100%'} height={120}
          />
        <Paragraph style={styles.categoryName}>{category.name}</Paragraph>
      </View>
    </TouchableRipple>
  )
}

const CategoryList = ({navigation}) => {
  const store = useContext(storeContext)
  const { colors } = useTheme()
  const styles = getStyle({colors})
  const [categories, setCategories] = useState(store.categories.data)

  const loadData = async () => {
    try {
      const response = await axios.get(BaseUrl + '/api/categories/?limit=10000')
      store.categories = response.data // update store categories
      // setCategories(response.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <FlatList
      style={styles.container}
      data={categories}
      extraData={[]}
      refreshing={false}
      onRefresh={() => { loadData() }}
      keyExtractor={item => (item.id.toString())}
      renderItem={({item}) => (<ListItem category={item} styles={styles} navigation={navigation} />)}
     />
  )
}

function getStyle({colors}){
  return (
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      listItem: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginBottom: 16,
        elevation: 2,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
      categoryImage: {
        width: '100%',
        height: 100,
      },
      categoryName: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        paddingVertical: 6,
        color: colors.text,
        textTransform: 'capitalize',
      },
    })
  )
}

export default observer(CategoryList)
