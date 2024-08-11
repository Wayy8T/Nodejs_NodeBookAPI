import db from '../models'


export const getOne = (userId) => new Promise(async (resolve, reject) => {
    try {
        const respone = await db.User.findOne({
            where: { id: userId },
            attributes: {
                // exclude
                exclude: ['password']
            }
        })

        resolve({
            err: respone[1] ? 0 : 1,
            mes: respone[1] ? 'Got' : "User not found",
            userData: respone
        })

        console.log('after resolve')
    } catch (error) {
        reject(error)
    }
})
