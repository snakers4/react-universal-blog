/*
  
Junk left from other HTTP call libs

  let testParams = {
    apiParams: '{"key":"aveysov_37db73bb0ce8f672618770b1956f8798","method":{"name":"getArticleFeed","version":1},"params":[]}',
    apiUrl: 'http://tomb.space:8086/poligon/news-blog/Api/apiHandler.php'   
  }

  $.ajax({
    type: "POST",
    data: {"query" : testParams.apiParams},
    url: config.apiUrl,
    success: function(result) {
      var jsonResult = JSON.parse(result);
      let resultObject = {
        apiReply:jsonResult,
        apiData: jsonResult.response.data
      }

      console.log(JSON.stringify(resultObject))

    }.bind(this)    
  })
  */
 
/*
  let instance = axios.create()
      instance.defaults.headers.common = {}
    
  instance({
    url: testParams.apiUrl,
    timeout: 2,
    method: 'post',
    data: {
      query: testParams.apiParams,
    }

  })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(response){
      console.log(response)      
    })
    
  reqwest({
      url: testParams.apiUrl
    , method: 'post'
    , data: { query: testParams.apiParams}
    , headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }    
    , success: function (resp) {
        console.log(resp)
      }
  })    
  

  request({
      url: testParams.apiUrl,
      qs: {query: testParams.apiParams}, //Query string data
      method: 'POST' //Specify the method

  }, function(error, response, body){
      if(error) {
          console.log(error)
      } else {
          console.log(response.statusCode, body)
      }
  });

*/