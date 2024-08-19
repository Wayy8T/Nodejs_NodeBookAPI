import db from '../models'
import data from '../../data/data.json'


export const insertData = () => new Promise(async (resolve, reject) => {
    try {

        console.log(Object.keys(data))
        resolve('Insert successfully')

        console.log('after resolve')
    } catch (error) {
        reject(error)
    }
})
