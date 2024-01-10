export async function login (email, password) {
    return new Promise ((resolve, reject) => {
        fetch('/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, password: password})
            }
        )
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
}

export async function newUser (name, email, password) {
    return new Promise ((resolve, reject) => {
        fetch('/api/newUser',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name, email: email, password: password})
            }
        )
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
}