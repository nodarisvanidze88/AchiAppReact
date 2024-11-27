import { useEffect, useState } from "react"
import { URLS } from './urls'
import { useNavigate } from "react-router-dom"

export function UsersOrders() {
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [validUser, setValidUser] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        fetch(URLS[0].GetUsers)
            .then(responce => responce.json())
            .then(data => {
                setUsers(data)
            })
    }, [])
    const userValidation =()=> {
        if (currentUser !=="" && users.some((item)=> item.user === currentUser)){
            setValidUser(true)
            // navigate(`${currentUser}/${users.id}`)
        }

    }
    console.log(validUser)
    return (
        <div>
            <input type="text" onChange={(e)=> {
                setCurrentUser(e.target.value)
                // userValidation()
            }}/>
        </div>
    )
}