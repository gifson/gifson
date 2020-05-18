import {apiKey} from '../secret'

export async function getTrending(){
    const endpoint = '//api.giphy.com/v1/gifs/trending'
    const url = `${endpoint}?key=${apiKey}`
    return await fetchData(url)
}

export async function getByQuery( query, offset = 0 ){
    console.log('getByQuery', query)
    const endpoint = '//api.giphy.com/v1/gifs/search'
    const url = `${endpoint}?key=${apiKey}&q=${escape(query)}&offset=${offset}`
    return await fetchData(url)
}

export async function get404(){
    const rand = parseInt( Math.random() * 10 )
    const items = await getByQuery('Not Found')
    return items[rand]
}
  
  // async function get404(){
  //   const endpoint = '//api.giphy.com/v1/gifs/random'
  //   const url = `${endpoint}?key=${apiKey}&tag=Not Found`
  //   return await fetchData(url)
  // }
  
async function fetchData(url){
    const response = await fetch(url)
      .catch(console.warn)
    const {data, pagination} = await response.json()
    console.log(`fetched`, data, pagination )
    if( data instanceof Array && pagination && pagination.count < pagination.total_count ){
      data.pagination = pagination
    }
    return data
}