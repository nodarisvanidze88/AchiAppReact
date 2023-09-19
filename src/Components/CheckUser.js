import { useEffect, useState } from "react";
import BackForward from "./BackForward";
import {useNavigate} from 'react-router-dom'

export default function CheckUser() {
    const [user, setUser] = useState('')
    const [userValue, setUserValue] = useState('')
    const [selectdID, setSelectedID] = useState('')
    const navigate = useNavigate()
    useEffect(()=> {
        fetch('http://192.168.100.2:8000/fi/getusers')
        .then(res => res.json())
        .then(data => {
            setUser(data)
        })
    },[])
    useEffect(() => {
        if(selectdID) {
            navigate(`/backforward/${userValue}/${selectdID}`)
        }
    },[selectdID,navigate,userValue])
    
    const checkInput = () => {
        for (let i=0 ; i< user.length; i++) {
            if(user[i].user === userValue) {
                setSelectedID(user[i].id)
                return
            }
        }
}
    return (
        <div>
            <form onSubmit={checkInput}>
            <input onChange={(e)=>setUserValue(e.target.value)} />
            <button type="submit">Enter</button>
            </form>
        </div>
    )
}