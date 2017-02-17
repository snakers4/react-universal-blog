// config.js
export default {
  apiKey: 'aveysov_37db73bb0ce8f672618770b1956f8798',
  apiUrl: 'http://api.spark-in.me/apiHandler.php',	
  site: {
    title: 'Tomb in space'
  },
  bucket: {
    slug: process.env.COSMIC_BUCKET || 'react-universal-blog',
    media_url: 'https://cosmicjs.com/uploads',
    read_key: process.env.COSMIC_READ_KEY || '',
    write_key: process.env.COSMIC_WRITE_KEY || ''
  },
}

