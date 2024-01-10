const faunadb = require('faunadb')
const q = faunadb.query

export async function logout (secret, deleteAllTokens = false) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(q.Logout(deleteAllTokens));
}

export async function getCurrentUsersName (secret) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Select(
            'data',
            q.Get(q.CurrentIdentity())
        )
        
    )
}

export async function projectList (secret) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Call(
            q.Function("projectListByUser"),
            q.CurrentIdentity()
        )
    )
}

export async function bugsList (secret, projectId) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Call(
            q.Function("bugsByProject"),
            projectId
        )
    )
}

export async function teamMembersList (secret, projectId) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Call(
            q.Function("usersByProject"),
            projectId
        )
    )
}

async function canModifyProject (secret, projectId) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Call(
            q.Function("IdentityCheck"),
            q.Ref(q.Collection('Projects'), projectId)
        )
    )
}

export async function updateProjectName (secret, project, name, description) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query (
            q.Update(
            q.Ref(q.Collection('Projects'), project),
            {
                data:
                {
                    Name: name,
                    Description: description
                }
            }
            )
        )
}

export async function newProject (secret, name, description) {
    const client = new faunadb.Client({ secret: secret })
    return client.query(
        q.Create(
            q.Collection("Projects"),
            {
                data: 
                {
                    Name: name,
                    Description: description,
                    Users: [q.CurrentIdentity()],
                    Bugs: []
                }
            }
        )
    )
}

export async function addUserToProject (secret, projectId, newUserId) {
    const client = new faunadb.Client({ secret: secret })
    return client.query(
        q.Update(
            q.Ref(q.Collection('Projects'), projectId),
            {
                data:
                {
                    //    Append ( Select the ref for the new user  -with- Select all users listed in project with projectId         
                    Users: q.Append(q.Ref(q.Collection('Users'), newUserId), q.Select(['data', 'Users'], q.Get(q.Ref(q.Collection('Projects'),projectId))))
                }
            }
            )
    )
}

export async function removeUserFromProject (secret, projectId, oldUserId) {
    const client = new faunadb.Client({ secret: secret })
    return client.query(
        q.Update(
            q.Ref(q.Collection('Projects'), projectId),
            {
                data:
                {
                    //Look up the current array of users in the project collection and remove the old user from this list
                    //  Difference      List of all users for projectId    -with-    [Ref for this user Id]
                    Users: q.Difference(q.Select(['data', 'Users'], q.Get(q.Ref(q.Collection('Projects'),projectId))),[q.Ref(q.Collection('Users'), oldUserId)])
                }
            }
        )
    )
}

export async function addBug (secret, projectId, title, description, status = "Open") {
    const client = new faunadb.Client({ secret: secret })
    return new Promise ((resolve, reject) => {
        canModifyProject(secret, projectId)
        .then((response) => {
            if(response) {
                //Add bug to the Bugs collect
                client.query(
                    q.Create(
                        q.Collection("Bugs"),
                        {
                            data: 
                            {
                                title: title,
                                description: description,
                                status: status,
                                owner: q.CurrentIdentity()
                            }
                        }
                    )
                )
                .then((responseData) => {
                //Add new bug to project passed as a prop
                console.log(responseData)
                client.query (
                    q.Update(
                    q.Ref(q.Collection('Projects'), projectId),
                    {
                        data:
                        {
                            //    Append ( Select the ref from the bug created in the above code  -with- Select all bugs listed in project with projectId         
                            Bugs: q.Append(q.Select(['ref'], responseData), q.Select(['data', 'Bugs'], q.Get(q.Ref(q.Collection('Projects'),projectId))))
                        }
                    }
                    )
                )
                resolve(responseData)
                })
                .catch((error) => reject(`Error adding to project list ${JSON.stringify(error)}`))
            } else {
            reject('Unauthorised, insufficient privileges to modify this project.')
            }
        })
        .catch((error) => {
            reject (`FaunaDB query error: ${JSON.stringify(error)}`)
        })
    })
}

export async function modifyBug (secret, bugId, title, description, status, owner = null) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query (
            q.Update(
            q.Ref(q.Collection('Bugs'), bugId),
            {
                data:
                {
                    title: title,
                    description: description,
                    status: status,
                    owner: owner
                }
            }
            )
        )
}

export async function deleteBug (secret, projectId, bugId) {
    const client = new faunadb.Client({ secret: secret })
    return new Promise( (resolve, reject) => {
        client.query( //need some sort of await in here!
            q.Update(
                q.Ref(q.Collection('Projects'), projectId),
                {
                    data:
                    {
                        //Look up the current array of bugs in the project collection and remove the bugId from this list
                        //  Difference      List of all bugs for projectId    -with-    [Ref for this bugId]
                        Bugs: q.Difference(q.Select(['data', 'Bugs'], q.Get(q.Ref(q.Collection('Projects'),projectId))),[q.Ref(q.Collection('Bugs'), bugId)])
                    }
                }
            )
        )
        .then(() => 
            client.query(
                q.Delete(q.Ref(q.Collection('Bugs'), bugId))
            )
            .then((response) => resolve(response))
            .catch((error) => reject(`Error in deleting bug: ${JSON.stringify(error)}`))
        )
        .catch((error) => reject(`Error in removing bug from project list: ${JSON.stringify(error)}`))
    })
}

export async function userList (secret) {
    const client = new faunadb.Client({ secret: secret })
    return await client.query(
        q.Select(['data'],
            q.Map(
                q.Paginate(q.Match(q.Index("all_users"))),
                q.Lambda(
                "Users",
                q.Let(
                    {
                    userDoc: q.Get(q.Var("Users"))
                    },
                    {
                    name: q.Select(["data", "name"], q.Var("userDoc")),
                    id: q.Select(["ref", 'id'], q.Var("userDoc"))
                    }
                )
                )
            )
        )
    )
}