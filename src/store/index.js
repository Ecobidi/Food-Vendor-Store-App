import React from 'react'
import { decorate, observable } from 'mobx'

class PageDataTemplate {
  data = []
  totalCount = 0
  currentPage = 1
  offset = 0
  limit = 10
}

let observablePageData = {
  data: observable, totalCount: observable, currentPage: observable, offset: observable, limit: observable,
}

class Categories extends PageDataTemplate {}

class Products extends PageDataTemplate {}

class Orders extends PageDataTemplate {}

class Store {
  token = 'obidi'
  isLoggedIn = false
  profile = {}
  categories = new Categories()
  orders = new Orders()
  products = { } // new Products()
  cart = []
  cartQty = 0
}

decorate(Categories, observablePageData)
decorate(Products, observablePageData)
decorate(Orders, observablePageData)

decorate(Store, {
  token: observable,
  isLoggedIn: observable,
  categories: observable,
  orders: observable,
  products: observable,
  cart: observable,
  cartQty: observable,
})

export const storeContext = React.createContext()

export default new Store()