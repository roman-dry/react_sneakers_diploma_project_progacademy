import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import styles from './Orders/Orders.module.scss';

function Login({ setUserViewName, isLoginTrue, setIsLoginTrue, setUser, setCardCart, setFavorites }) {	
			
	const [isWrongPass, setIsWrongPass] = useState("");
	const { register, handleSubmit } = useForm();

	async function onSubmit(obj) {
		const { data } = await axios.post('https://diploma-project-w89i.onrender.com/login', obj);
		if(data.email === obj.email && data.password === obj.password) {
			const userId = Number(data.id);
			const cartResponse = await axios.get(`https://diploma-project-w89i.onrender.com/cart?user_id=${userId}`);
			const favoriteResponse = await axios.get(`https://diploma-project-w89i.onrender.com/favorite?user_id=${userId}`);
			setCardCart(cartResponse.data);
			setFavorites(favoriteResponse.data);
			setUserViewName(data.name);
			setIsLoginTrue(true);
			setIsWrongPass("");
			setUser(data);
		} else {
			setIsWrongPass("Wrong login or password!")
		}
	}
		
	return (
		<div>
			<div className='text-center pb-4'>
				{
					!isLoginTrue ? <><h6 className="mt-4">Login or <Link to="/registration"><span>Registration</span></Link></h6>

					<form className="mt-3" onSubmit={handleSubmit(onSubmit)}>					
						<input {...register('email', { required: true })} className="mt-3" name="email" placeholder="Email" /><br />
						<input {...register('password', { required: true })} className="mt-3" name="password" type="password" placeholder="Password" /><br />
						<button type="submit" className={styles.submitBtn}>Submit</button> 
					</form></> : 
					<><h3 className='mt-5'>Thank you for login!</h3>
					<Link to="/"><h4 className="navbar-brand">Get Sneakers</h4></Link></>
				}
				<span style={{color: 'red'}}>{isWrongPass}</span>
			</div>
		</div>
	)
}

export default Login;