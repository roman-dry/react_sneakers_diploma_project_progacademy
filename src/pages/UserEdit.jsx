import React, { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from "react-redux";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import axios from 'axios';

import styles from './Orders/Orders.module.scss';
import stylesReg from './Registration.module.scss';

function UserEdit({ url, currentUser }) {
    const { register, handleSubmit, formState: { errors }, control } = useForm();
    const token = useSelector((state) => state.tokenReducer.item.access_token);
    const [isUser, setIsUser] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [inputValueName, setInputValueName] = useState(currentUser.name);
    const [inputValueEmail, setInputValueEmail] = useState(currentUser.email);
    const [inputValuePassword, setInputValuePassword] = useState('');


    function handleChangeName(e) {
        setInputValueName(e.target.value);
    }

    function handleChangeEmail(e) {
        setInputValueEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setInputValuePassword(e.target.value);
    }

    async function onSubmitEdit(obj) {
        let name = obj.name;
        let email = obj.email;
        let phone = obj.phone;
        let password = obj.password;
        
        if(currentUser.name) {
            try {
                await axios.patch(`${url}user/edit?id=${currentUser.id}&name=${name}&email=${email}&phone=${phone}&password=${password}`, JSON.stringify({}),
                {headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'application/json'
                 }          
                });
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
                
				<label>Edit name<br /><input className={styles.formWidthEdit} {...register('name', { required: true, pattern: /^[A-Za-z]+$/i })} 
                    name="name" value={inputValueName} onChange={handleChangeName} /></label><br />				
				<label>Edit email<br /><input className={styles.formWidthEdit} {...register('email', { required: true, pattern: {
						value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					} })} 
                    name="email" value={inputValueEmail} onChange={handleChangeEmail} /></label><br />
                    {errors["email"] && (
						<p className={stylesReg.colorError} >Invalid email address!</p>
				)}
                <label>Edit phone<br /><div className={stylesReg.phoneController}>
					<Controller
					name="phone"
					control={control}
					rules={{
						validate: (value) => isValidPhoneNumber(value)
					  }}
					render={({ field: { onChange, value } }) => (
						<PhoneInput
							placeholder="Phone"
							value={value}
							onChange={onChange}
							defaultCountry="UA"
							id="phone"
						/>
					)}
					/>
					{errors["phone"] && (
						<p className={stylesReg.colorError} >Invalid Phone!</p>
					)}
				</div></label><br />	
                <label>Edit password<br /><input type="password" className={styles.formWidthEdit} {...register('password', { required: true, minLength: 6 })} 
                    name="password" value={inputValuePassword} onChange={handleChangePassword} /></label><br />
                {errors["password"] && (
						<p className={stylesReg.colorError} >Password is too short!</p>
				)}	
                		
				<button type="submit" className={styles.submitBtn}>Submit</button> 
                <button type="reset" style={{background: 'blue'}} className={styles.submitBtn}>Reset</button> 
			</form>
            {isEdited ? <span style={{color: 'green'}}>You successfully edited profile </span> : ''}
            {isUser ? <span style={{color: 'red'}}>You have not root to edit an profile!</span> : ''}

        </div>
    )
}

export default UserEdit;