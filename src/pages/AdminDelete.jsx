import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import styles from './Orders/Orders.module.scss';

function AdminDelete({ url, user }) {
    const { register, handleSubmit} = useForm();
    const [cardId, setCardId] = useState(0);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    async function changeLastIdDB(newLastId, lastId) {        

        try {            
			await axios.patch(`${url}admin?id=${newLastId}&last_id=${lastId}`);
		} catch (error) {
			alert('Failed to update card in data base');
		}	

    }

    async function getNewLastItem(lastId) {
        let newLastId;
        try {
            const { data } = await axios.get(url); 
            if(data.length) {
                const lastItem = data[data.length - 1]; 
                newLastId = lastItem.id;               
            } else {
                alert(`Last item id was ${lastId}`);
            }
                       
        } catch (error) {
            alert('Failed to get an id of last item');
        }
        changeLastIdDB(newLastId, lastId)

    }

    async function onSubmitDelete(obj, lastId) {
        
        try {            
			await axios.delete(`${url}${obj.id}`);
            setIsRemoved(true);
            setCardId(obj.id);
		} catch (error) {
			alert('Failed to remove card in data base');
		}	

        getNewLastItem(lastId);
					
	}

    async function getLastId(obj) {
        if(user.role === "ADMIN") {
            let lastId;
            try {
                const { data } = await axios.get(`${url}${obj.id}`);
                lastId = data.last_id;

            } catch {
                alert('Failed to get card from data base');

            }        
            onSubmitDelete(obj, lastId);

        } else {
            setIsAdmin(true);
        }
        
    }

    function returnToMainAdminPage() {
        return navigate('/admin');
    }

    return (
        <div className="m-5 pb-3">
            <h3 className="mt-4">ITEM REMOVAL FORM</h3>
            <form className='mt-3' onSubmit={handleSubmit(getLastId)}>
                <input className={styles.formWidth} {...register('id', { required: true })} 
                    name="id" placeholder="ID" /><br />					
				<button type="submit" className={styles.submitBtn}>Submit</button> 
                <button type="reset" style={{background: 'blue'}} className={styles.submitBtn}>Reset</button> 
			</form>
            <p style={{color: 'blue', cursor: 'pointer', marginTop: '20px'}} onClick={returnToMainAdminPage}>Return to main Admin page</p>
            {isRemoved ? <span style={{color: 'green'}}>You successfully removed item # <span style={{color: 'red'}}>{cardId}</span> </span> : ''}
            {isAdmin ? <span style={{color: 'red'}}>You have not root to remove an item!</span> : ''}

        </div>
    )
}

export default AdminDelete;