import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import styles from './Orders/Orders.module.scss';

function AdminEdit({ url, user }) {
    const navigate = useNavigate();
    const { register: registerFirstField, handleSubmit: handleSubmitFirstForm} = useForm();
    const { register: registerSecondField, handleSubmit: handleSubmitSecondForm} = useForm();
    const [cardId, setCardId] = useState(0);
    const [isEdited, setIsEdited] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [inputValueId, setInputValueId] = useState('');
    const [inputValueParentId, setInputValueParentId] = useState('');
    const [inputValueTitle, setInputValueTitle] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [inputValueImageUrl, setInputValueImageUrl] = useState('');
    const [inputValueCount, setInputValueCount] = useState('');
    const [inputValueTotalPrice, setInputValueTotalPrice] = useState('');

    async function getItemById(id) {
        try {
            const { data } = await axios.get(`${url}${id}`);
            setInputValueParentId(data.parent_id);
            setInputValueTitle(data.title);
            setInputValuePrice(data.price);
            setInputValueImageUrl(data.imageURL);
            setInputValueCount(data.count);
            setInputValueTotalPrice(data.totalPrice);

        } catch {
            alert('Error get item by ID')
        }
        
    }

    function getId(obj) {
        setCardId(obj.currentId);
        getItemById(obj.currentId);
        setIsEdited(false);
    }

    function handleChangeId(e) {
        setInputValueId(e.target.value);
    }

    function handleChangeParentId(e) {
        setInputValueParentId(e.target.value);
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

    function handleChangeCount(e) {
        setInputValueCount(e.target.value);
    }

    function handleChangeTotalPrice(e) {
        setInputValueTotalPrice(e.target.value);
    }

    async function onSubmitEdit(obj) {	
        if(user.role === "ADMIN") {
            try {
                await axios.patch(`${url}?id=${obj.id}&title=${obj.title}&price=${obj.price}&imageURL=${obj.imageURL}&count=${obj.count}&totalPrice=${obj.totalPrice}&parent_id=${obj.parent_id}`);
                setIsEdited(true);
                setCardId(obj.id);
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
                <label>Default ID<br /><input className={styles.formWidthEdit} {...registerSecondField('id')} 
                    name="id" placeholder="ID" value={inputValueId} onChange={handleChangeId} /></label><br />
				<label>Edit parent_id<br /><input className={styles.formWidthEdit} {...registerSecondField('parent_id')} 
                    name="parent_id" value={inputValueParentId} onChange={handleChangeParentId} /></label><br />
				<label>Edit title<br /><input className={styles.formWidthEdit} {...registerSecondField('title')} 
                    name="title" value={inputValueTitle} onChange={handleChangeTitle} /></label><br />				
				<label>Edit price<br /><input className={styles.formWidthEdit} {...registerSecondField('price')} 
                    name="price" value={inputValuePrice} onChange={handleChangePrice} /></label><br />
                <label>Edit imageURL<br /><input className={styles.formWidthEdit} {...registerSecondField('imageURL')} 
                    name="imageURL" value={inputValueImageUrl} onChange={handleChangeImageUrl} /></label><br />	
                <label>Edit count<br /><input className={styles.formWidthEdit} {...registerSecondField('count')} 
                name="count" value={inputValueCount} onChange={handleChangeCount} /></label><br />	
                <label>Edit totalPrice<br /><input className={styles.formWidthEdit} {...registerSecondField('totalPrice')} 
                    name="totalPrice" value={inputValueTotalPrice} onChange={handleChangeTotalPrice} /></label><br />		
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