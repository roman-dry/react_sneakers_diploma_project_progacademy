import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios';

import styles from './Orders/Orders.module.scss';

function UserEdit({ url, user, isLoginTrue }) {
    const { register, handleSubmit } = useForm();
    const [isUser, setIsUser] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [inputValueName, setInputValueName] = useState(user.name);
    const [inputValueEmail, setInputValueEmail] = useState(user.email);
    const [inputValuePhone, setInputValuePhone] = useState(user.phone);
    const [inputValuePassword, setInputValuePassword] = useState(user.password);


    function handleChangeName(e) {
        setInputValueName(e.target.value);
    }

    function handleChangeEmail(e) {
        setInputValueEmail(e.target.value);
    }

    function handleChangePhone(e) {
        setInputValuePhone(e.target.value);
    }

    function handleChangePassword(e) {
        setInputValuePassword(e.target.value);
    }

    async function onSubmitEdit(obj) {
        if(isLoginTrue) {
            try {
                await axios.patch(`${url}user?id=${user.id}&name=${obj.name}&email=${obj.email}&phone=${obj.phone}&password=${obj.password}`);
                setIsEdited(true);
            } catch (error) {
                alert('Failed to edit the profile');
            }	

        } else {
            setIsUser(true);
        }                     
					
	}
    
    return (
        <div className="m-5 pb-3">
            <h3 className="mt-4">USER EDITING FORM</h3>            
            
            <form className='mt-5' onSubmit={handleSubmit(onSubmitEdit)}>
                
				<label>Edit name<br /><input className={styles.formWidthEdit} {...register('name')} 
                    name="name" value={inputValueName} onChange={handleChangeName} /></label><br />				
				<label>Edit email<br /><input className={styles.formWidthEdit} {...register('email')} 
                    name="email" value={inputValueEmail} onChange={handleChangeEmail} /></label><br />
                <label>Edit phone<br /><input className={styles.formWidthEdit} {...register('phone')} 
                    name="phone" value={inputValuePhone} onChange={handleChangePhone} /></label><br />	
                <label>Edit password<br /><input type="password" className={styles.formWidthEdit} {...register('password')} 
                    name="password" value={inputValuePassword} onChange={handleChangePassword} /></label><br />	
                		
				<button type="submit" className={styles.submitBtn}>Submit</button> 
                <button type="reset" style={{background: 'blue'}} className={styles.submitBtn}>Reset</button> 
			</form>
            {isEdited ? <span style={{color: 'green'}}>You successfully edited profile </span> : ''}
            {isUser ? <span style={{color: 'red'}}>You have not root to edit an profile!</span> : ''}

        </div>
    )
}

export default UserEdit;