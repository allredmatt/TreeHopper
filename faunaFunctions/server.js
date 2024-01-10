const faunadb = require('faunadb')
const q = faunadb.query
const FAUNA_KEY = process.env.FAUNA_KEY

const client = new faunadb.Client({ secret: FAUNA_KEY })

export async function authenticate (email, password) {
    return await client.query(
      q.Login(
        q.Match(q.Index('UsersByEmail'), email),
        {password: password}
      )
    );
}

export async function newUser (name, email, password) {
  await client.query(
    q.Create(
      q.Collection('Users'),
      {
        data: {
          name: name,
          email: email
        },
        credentials: {
          password: password
        }
      }
    )
  )
  return await authenticate (email, password)
}

