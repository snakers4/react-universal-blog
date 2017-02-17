// actions.js
import config from '../config'
import Cosmic from 'cosmicjs'
import _ from 'lodash'
// we are using jquery for testing and knowledge purposes 
// AppStore
import AppStore from '../stores/AppStore'
import reqwest  from 'reqwest'


/**
 * API-param constructor wrapper
 */
function paramConstructor (apiKey, methodData, params) {

  let callParams = {
    key: apiKey,
    method: {
        name: methodData.methodName,
        version: methodData.methodVersion
    },
    params: params
  }

  callParams = JSON.stringify(callParams)

  return callParams

}

/**
 * API-call wrapper using reqwest
 */

function apiCall (callParams, callback) {

  let response = reqwest({
        url:  config.apiUrl
      , method: 'post'
      , data: { query: callParams}
      , success: function (resp) {
        /*
        Do nothing here?
        */

        }
  })
  .then(function(response){
    try {
        JSON.parse(response);
    } catch (e) {
      return callback(true, response)
    }
    // console.log( response )
    return callback(false, JSON.parse(response).response.data)
  })     

}



export function getStore(callback){

  let callParams = paramConstructor (config.apiKey, {methodName: 'getBlogObjects', methodVersion:1}, [])
 
  /*
  Calling API to get blog globals
  */
  apiCall(callParams, function(err, response){

    if(err == false) {

      /* No api call error*/
      /* Calling api to get blog articles */

      let blogGlobals = response

      let callParams = paramConstructor (config.apiKey, {methodName: 'getArticleFeed', methodVersion:1}, [])
      apiCall(callParams, function(err, response){
  
        if(err == false) {

          /* No api call error*/
          let articleFeed = response

          /*
          For backwards compatibility adding values one by one...
          */
          /* Set global params  */          
          let globals2 = {}
          globals2.text = {}
          globals2.text.menu_title = blogGlobals.globals.menu_title.value
          globals2.text.footer_text = blogGlobals.globals.footer_text.value
          globals2.text.site_title = blogGlobals.globals.site_title.value
          globals2.social = {}
          globals2.social.telegram = blogGlobals.social.telegram.value
          globals2.nav_items = blogGlobals.globals.nav_items

          let AppStore2 = {}
          AppStore2.data = {}

          AppStore2.data.globals = globals2


          /* Set page list  */ 
          let pages = blogGlobals.globals.pages

          AppStore2.data.pages = pages
          
          /* Set article feed  */          
          let articles = articleFeed
          AppStore2.data.articles = articles

          /*
          Some forking code for testing
          */
          AppStore.tempData = AppStore2.data

          AppStore.data = AppStore.tempData 

          // Emit change
          AppStore.data.ready = true
          AppStore.emitChange()

          // Trigger callback (from server)
          if(callback){
            callback(false, AppStore)
          }

   
        } else {

          console.log('Api call error ' + response)

        }

      })

    } else {

      console.log('Api call error ' + response)

    }

  })


}


export function getPageData(page_slug, post_slug){

  if(!page_slug || page_slug === 'blog')
    page_slug = 'home'
  
  // Get page info
  // console.log(AppStore)

  const data = AppStore.data
  const pages = data.pages
  const page = _.findWhere(pages, { slug: page_slug })
  const hero = page.hero.url

  const headline =  page.headline.value
  const subheadline = page.subheadline.value

  /* Correct the logic here later */
  console.log(1)
  console.log(hero)
  console.log(page)



  page.hero = hero
  page.headline = headline
  page.subheadline = subheadline

  if(post_slug){
    if(page_slug === 'home'){
      const articles = data.articles

      // console.log(articles)  
      const article = _.findWhere(articles, { slug: post_slug })

      //console.log(article)

      page.title = article.title
    }
  }
  AppStore.tempData.page = page
  AppStore.emitChange()
  AppStore.data.page = AppStore.tempData.page

  AppStore.emitChange()

}

export function getMoreItems(){
  
  AppStore.data.loading = true
  AppStore.emitChange()

  setTimeout(function(){
    let item_num = AppStore.data.item_num
    let more_item_num = item_num + 5
    AppStore.data.item_num = more_item_num
    AppStore.data.loading = false
    AppStore.emitChange()
  }, 300)
}