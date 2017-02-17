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
    let tempData = JSON.parse(response).response.data
    return callback(false, tempData)
  })     

}



export function getStore(callback){

  let pages = {}

  Cosmic.getObjects(config, function(err, response){

    let objects = response.objects
    
    /* Globals
    ======================== */
    let globals = AppStore.data.globals
    globals.text = response.object['text']


    let metafields = globals.text.metafields

    let menu_title = _.findWhere(metafields, { key: 'menu-title' })

    globals.text.menu_title = menu_title.value
    /* Added */

    let footer_text = _.findWhere(metafields, { key: 'footer-text' })

    globals.text.footer_text = footer_text.value
    /* Added */

    let site_title = _.findWhere(metafields, { key: 'site-title' })
    globals.text.site_title = site_title.value
    /* Added */
    
    // Social
    globals.social = response.object['social']
    metafields = globals.social.metafields
    let twitter = _.findWhere(metafields, { key: 'twitter' })
    globals.social.twitter = twitter.value
    let facebook = _.findWhere(metafields, { key: 'facebook' })
    globals.social.facebook = facebook.value
    let github = _.findWhere(metafields, { key: 'github' })
    globals.social.github = github.value
    /* Added */


    // Nav
    const nav_items = response.object['nav'].metafields
    globals.nav_items = nav_items
    /* Added */
    AppStore.data.globals = globals


    /* Pages
    ======================== */
    let pages = objects.type.page
    AppStore.data.pages = pages
     /* Added */



    /* Articles
    ======================== */
    let articles = objects.type['post']
    articles = _.sortBy(articles, 'order')
    AppStore.data.articles = articles

     /* Added */



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


    AppStore.tempData = AppStore2.data

    AppStore.data = {} 
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



  })

}


export function getPageData(page_slug, post_slug){

  if(!page_slug || page_slug === 'blog')
    page_slug = 'home'
  

  // Get page info
  const data2 = AppStore.tempData
  const pages2 = data2.pages


  const page2 = _.findWhere(pages2, { slug: page_slug })
  page2.hero = config.bucket.media_url + '/' + page2.hero.value
  page2.headline = page2.headline.value
  page2.subheadline = page2.subheadline.value


  if(post_slug){
    if(page_slug === 'home'){
      const articles2 = data2.articles
      const article2 = articles2.post_slug
      page2.title = article2.title
    }
  }
  AppStore.tempData.page = page2
  AppStore.emitChange()


  if(!page_slug || page_slug === 'blog')
    page_slug = 'home'
  
  // Get page info
  const data = AppStore.data
  const pages = data.pages

  const page = _.findWhere(pages, { slug: page_slug })
  const metafields = page.metafields
  if(metafields){
    const hero = _.findWhere(metafields, { key: 'hero' })

    page.hero = config.bucket.media_url + '/' + hero.value

    const headline = _.findWhere(metafields, { key: 'headline' })
    page.headline = headline.value


    const subheadline = _.findWhere(metafields, { key: 'subheadline' })

    page.subheadline = subheadline.value
  }

  if(post_slug){
    if(page_slug === 'home'){
      const articles = data.articles
      const article = _.findWhere(articles, { slug: post_slug })
      page.title = article.title
    }

    /*
    if(page_slug === 'work'){
      const work_items = data.work_items
      const work_item = _.findWhere(work_items, { slug: post_slug })
      page.title = work_item.title
    }
    */
  }
  AppStore.data.page = page
  AppStore.data.page = AppStore.tempData.page
  AppStore.emitChange()

  console.log(AppStore.data)
  console.log(AppStore.tempData)

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