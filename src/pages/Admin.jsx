import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Link } from 'react-router-dom';

import styles from './Orders/Orders.module.scss';

function Admin({ url, currentUser }) {
    const { register, handleSubmit} = useForm();
    const [cardId, setCardId] = useState(0);
    const [allItems, setAllItems] = useState([]);
    const [isRequestItems, setIsRequestItems] = useState(false)
    const [isAdded, setIsAdded] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const token = useSelector((state) => state.tokenReducer.item.access_token);

    useEffect(() => {
        async function getAllCards() {
            try {
                const { data } = await axios.get(url); 
                if(data.length) {
                    setAllItems(data);
                }
                           
            } catch (error) {
                alert('Failed to get an id of last item');
            }
        }
        getAllCards(); 

    }, [])

    async function onSubmit(obj) {	
        const objCreate = {
            "title": obj.title,
            "price": obj.price,
            "imageURL": obj.imageURL,
            "count": 1,
            "totalPrice": obj.price,
            "parent_id": ""
        }
        if(currentUser.role === "ADMIN") {
            try {
                const { data } = await axios.post(`${url}`, JSON.stringify(objCreate),
                {headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'application/json'
                 }          
                });
                await axios.patch(`${url}?id=${data.id}&title=${data.title}&price=${data.price}&imageURL=${data.imageURL}&count=${data.count}&totalPrice=${data.price}&parent_id=${data.id}`,
                {headers: {
                     Authorization: `Bearer ${token}`
                 }          
                });
                setCardId(data.id)
                setIsAdded(true);
            } catch (error) {
                alert('Failed to add card to data base');
            }

        } else {
            setIsAdmin(true);
        }     
					
	}

    function getListOfItems() {
        if(isRequestItems) {
            setIsRequestItems(false);
        } else {
            setIsRequestItems(true);
        }
    }
   
    return (
        <div className="m-5 pb-3">
            <h3 className="mb-2">FORM TO ADD A NEW ITEM</h3>
            <form className='mt-3' onSubmit={handleSubmit(onSubmit)}>
				<input className={styles.formWidth} {...register('title', { required: true })} 
                    name="title" placeholder="Title" /><br />				
				<input className={styles.formWidth} {...register('price', { required: true })} 
                    name="price" placeholder="Enter price" /><br />
                <input className={styles.formWidth} {...register('imageURL', { required: true })} 
                    name="imageURL" placeholder="Enter imageURL" /><br />	
				<button type="submit" className={styles.submitBtn}>Submit</button> 
                <button type="reset" style={{background: 'blue'}} className={styles.submitBtn}>Reset</button> 
			</form>
            {isAdded ? <span style={{color: 'green'}}>You successfully added item # <span style={{color: 'red'}}>{cardId}</span> </span> : ''}
            {isAdmin ? <span style={{color: 'red'}}>You have not root to add an item!</span> : ''}

            <h5 className='mt-3' style={{color: 'blue', cursor: 'pointer'}} onClick={getListOfItems}>Get all Items</h5>
            {isRequestItems && (currentUser.role === 'ADMIN') ? <table border='2'><thead><tr><th>ID</th><th>Title</th><th>Price</th>
                <th>ImageURL</th></tr></thead><tbody>{
                    allItems.map(item => {
                        return <tr key={item.id}><td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.price}</td>
                        <td>{item.imageURL}</td></tr>
                    })}</tbody></table> : ''}
            <h5 className='mt-3'><Link to='/edit'>Follow the link if you want to EDIT item</Link></h5>
            <h5 className='mt-3'><Link to='/remove'>Follow the link if you want to REMOVE item</Link></h5>

        </div>
    )
}

export default Admin;