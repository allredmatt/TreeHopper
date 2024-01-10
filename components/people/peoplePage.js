import { userList } from '../../faunaFunctions/client'
import { useState, useEffect } from 'react'

export default function People ({token}) {

    const [peopleList, setPeopleList] = useState([])

    useEffect(() => {
        userList(token).then((returnedProjects) => {
            setPeopleList(returnedProjects)
        })
    }, [])

    return(
        <div>
            {peopleList.map((person) => {
                return (
                    <div>{person.name}</div>
                )
            })}
        </div>
    )
}