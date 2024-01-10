import {authenticate} from '../../faunaFunctions/server'

export default (req, res) => {
    return new Promise((resolve, reject) => {
        authenticate(req.body.email, req.body.password)
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