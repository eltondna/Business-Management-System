import "./UserListItem.scss"
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {BASE_URL} from "../../config"
import {useContext} from "react";
import {UserContext} from "../../App"
import axios from 'axios'
import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

import Notification from "../Notification/Notification";
const UserListItem = ({user, setOpenEdit, setEditUser })=>{
    const {currentUser} = useContext(UserContext)
    const queryClient = useQueryClient();

    const RemoveUser = async()=>{
        const payload = {
            id: user._id
        }
        return await axios.post(BASE_URL + '/admin/user/delete', payload);
    }

    const handleEdit = () => {
        setEditUser(user);
        setOpenEdit(true)
    }

    const mutation = useMutation({
        mutationFn: RemoveUser,
        // We can returned the renewed data directly from backend
        // no need to pass the payload to the mutation function
        onSuccess: ({data}) => {
        // Invalidate and refetch
        Notification("刪除成功", "success")
        return queryClient.invalidateQueries({ queryKey: ['userAll'] })
        },
    })

    const handleRemove = () => {
        mutation.mutate()
    }
    return (
        <div className="userListItem">
            <div className="field">{user.username}</div>
            <div className="field">
                {
                    user.avatar 
                    ? <img src={BASE_URL + '/' +user.avatar} alt="" className="avatar"/>
                    : <AccountCircleRoundedIcon className="icon"/>
                }
            </div>
            <div className="field">
                {
                    user.role === 1
                    ? <button className="admin">管理員</button>
                    : <button className="editor">編輯</button>
                }
            </div>
            <div className="field">
                <button className="edit" onClick={()=>handleEdit()}>編輯</button>
                {user._id !== currentUser.id && <button className="remove" onClick={handleRemove}>删除</button>}
            </div>
        </div>
    )
};
export default UserListItem;