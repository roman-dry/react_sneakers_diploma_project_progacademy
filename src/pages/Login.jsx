import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import styles from './Orders/Orders.module.scss';

function Login({ setUserViewName, isLoginTrue, setIsLoginTrue, setUser, setCardCart, setFavorites, url }) {	
			
	const [isWrongPass, setIsWrongPass] = useState("");
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

	async function onSubmit(obj) {
		const { data } = await axios.post(`${url}login`, obj);
		if(data.email === obj.email && data.password === obj.password && data.role === "ADMIN") {
			setUserViewName(data.name);
			setIsLoginTrue(true);
			setIsWrongPass("");
			setUser(data);

			return navigate('/admin')

		} else {
			if(data.email === obj.email && data.password === obj.password && data.role === "USER") {
				const userId = Number(data.id);
				const cartResponse = await axios.get(`${url}cart?user_id=${userId}`);
				const favoriteResponse = await axios.get(`${url}favorite?user_id=${userId}`);
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