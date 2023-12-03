import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';

import styles from './Orders/Orders.module.scss';

function AdminEdit({ url, currentUser }) {
    const navigate = useNavigate();
    const token = useSelector((state) => state.tokenReducer.item.access_token);
    const { register: registerFirstField, handleSubmit: handleSubmitFirstForm} = useForm();
    const { register: registerSecondField, handleSubmit: handleSubmitSecondForm} = useForm();
    const [cardId, setCardId] = useState(0);
    const [isEdited, setIsEdited] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [inputValueTitle, setInputValueTitle] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [inputValueImageUrl, setInputValueImageUrl] = useState('');

    async function getItemById(id) {
        try {
            const { data } = await axios.get(`${url}${id}`,
            {headers: {
                 Authorization: `Bearer ${token}`
             }          
            });
            setInputValueTitle(data.title);
            setInputValuePrice(data.price);
            setInputValueImageUrl(data.imageURL);
        } catch {
            alert('Error get item by ID')
        }        
    }

    function getId(obj) {
        setCardId(obj.currentId);
        getItemById(obj.currentId);
        setIsEdited(false);
    }

    function handleChangeTitle(e) {
        setInputValueTitle(e.target.value);
    }

    function handleChangePrice(e) {
        setInputValuePrice(e.target.value);
    }

    function handleChangeImageUrl(e) {
        setInputValueImageUrl(e.target.value);
    }

    async function onSubmitEdit(obj) {
        const objEdit = {
            "id": cardId,
            "title": obj.title,
            "price": obj.price,
            "imageURL": obj.imageURL,
            "count": 1,
            "totalPrice": obj.price,
            "parent_id": cardId

        }	
        if(currentUser.role === "ADMIN") {
            try {
                await axios.patch(`${url}?id=${objEdit.id}&title=${objEdit.title}&price=${objEdit.price}&imageURL=${objEdit.imageURL}&count=${objEdit.count}&totalPrice=${objEdit.totalPrice}&parent_id=${objEdit.parent_id}`,
                {headers: {
                     Authorization: `Bearer ${token}`
                 }          
                });
                setIsEdited(true);
                setCardId(objEdit.id);
            } catch (error) {
                alert('Failed to edit card in data base');
            }	

        } else {
            setIsAdmin(true);
        }        
					
	}

    function returnToMainAdminPage() {
        return navigate('/admin');
    }

    return (
        <div className="m-5 pb-3">
            <h3 className="mt-4">ITEM EDITING FORM</h3>
            Enter an ID that you want to edit:
                <div>
                <form onSubmit={handleSubmitFirstForm(getId)} {...registerFirstField('currentId')}>
                    <input  className={styles.formWidthEdit} name="currentId"></input><br />
                    <button type="submit" className={styles.submitBtn}>Submit</button>
                </form>

            </div>
            
            <form className='mt-5' onSubmit={handleSubmitSecondForm(onSubmitEdit)}>
				<label>Edit title<br /><input className={styles.formWidthEdit} {...registerSecondField('title')} 
                    name="title" value={inputValueTitle} onChange={handleChangeTitle} /></label><br />				
				<label>Edit price<br /><input className={styles.formWidthEdit} {...registerSecondField('price')} 
                    name="price" value={inputValuePrice} onChange={handleChangePrice} /></label><br />
                <label>Edit imageURL<br /><input className={styles.formWidthEdit} {...registerSecondField('imageURL')} 
                    name="imageURL" value={inputValueImageUrl} onChange={handleChangeImageUrl} /></label><br />	
				<button type="submit" className={styles.submitBtn}>Submit</button> 
                <button type="reset" style={{background: 'blue'}} className={styles.submitBtn}>Reset</button> 
			</form>
            <p style={{color: 'blue', cursor: 'pointer', marginTop: '20px'}} onClick={returnToMainAdminPage}>Return to main Admin page</p>
            {isEdited ? <span style={{color: 'green'}}>You successfully edited item # <span style={{color: 'red'}}>{cardId}</span> </span> : ''}
            {isAdmin ? <span style={{color: 'red'}}>You have not root to edit an item!</span> : ''}

        </div>
    )
}

export default AdminEdit;