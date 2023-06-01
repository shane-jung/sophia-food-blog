import * as dotenv from 'dotenv'
dotenv.config()

import express, { Router } from 'express'

const app = express()


import path from 'path'
import { fileURLToPath } from 'url';


import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import helmet from 'helmet'
// import compression from 'compression'

export default function initializeServer(router: Router) {
  
  
  const isProduction = process.env.NODE_ENV === 'production'
  const origin = { origin: isProduction ? false : '*' }

 // app.set('trust proxy', 1)
  app.use(express.urlencoded({extended:true}))
  app.use(express.json())
  app.use(cookieParser())
//   app.use(cors(origin))  
//   app.use(helmet())
//   app.use(compression())  

  // app.use((request, response, next) => {
  //   response.header('Content-Security-Policy', "img-src 'self' *.githubusercontent.com")

  // app.use(function (req, res, next) {
  //   res.header("Content-Type",'application/json');
  //   next();
  // });

  //   return next()
  // })

  // app.use(express.static(path.join(__dirname, '../../public/')))
  app.use('/api', router) 
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../index.html'));
  })
  

  return app
}