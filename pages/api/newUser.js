import {newUser} from '../../faunaFunctions/server'

export default (req, res) => {
    console.log(req.body)
    return new Promise((resolve, reject) => {
        newUser(req.body.name, req.body.email, req.body.password)
            .then((data) => {
                res.status(200).json(data)
                resolve()
            })
            .catch((error) => {
                res.status(401).json(error)
                resolve()
            })
        
    })
}