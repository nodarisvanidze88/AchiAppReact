import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./CheckUser.css"

export default function CheckUser() {
    const [user, setUser] = useState('')
    const [userValue, setUserValue] = useState('')
    const [selectdID, setSelectedID] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        fetch('http://192.168.100.4:8000/fi/getusers')
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
    }, [])
    useEffect(() => {
        if (selectdID) {
            navigate(`/backforward/${userValue}/${selectdID}`)
        }
    }, [selectdID, navigate, userValue])

    const checkInput = () => {
        for (let i = 0; i < user.length; i++) {
            if (user[i].user === userValue) {
                setSelectedID(user[i].id)
                return
            }
        }
    }
    return (
        <div className="checkUser-div">
            <form onSubmit={checkInput} className="checkUser-form">
                <input onChange={(e) => setUserValue(e.target.value)} className="checkUser-input" placeholder="სუპერვაიზერი"/>
                <input onChange={(e) => setUserValue(e.target.value)} className="checkUser-input" placeholder="სუპერვაიზერი"/>
                {/* <button type="submit">Enter</button> */}
            </form>
        </div>
    )
}