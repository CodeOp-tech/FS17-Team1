import React, { useEffect, useState } from 'react';
import AuthApi from '../helpers/AuthApi';


function UsersView(props) {
    const [users, setUsers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        let response = await AuthApi.getUsers();
        if (response.ok) {
            setUsers(response.data);
            setErrorMsg('');
        } else {
            setUsers([]);
            setErrorMsg(`Error ${response.status}: ${response.statusText}`);
        }
    }

    if (errorMsg) {
        return <h2 style={{ color: 'red' }}>{errorMsg}</h2>
    }

    if (!users) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="UsersView">
            <h1>Users</h1>
            <ul>
            {
                users.map(u => <li key={u.id}>{u.name}</li>)
            }
            </ul>
        </div>
    );
}


export default UsersView;