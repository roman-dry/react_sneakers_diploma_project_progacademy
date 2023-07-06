import React, { useState } from 'react';

import styles from './Orders/Orders.module.scss';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Registration() {
	const { register, handleSubmit } = useForm();
	const [isSubmited, setIsSubmited] = useState(true)
	const [isFreeLogin, setisFreelogin] = useState("");

	async function onSubmit(obj) {
		const { data } = await axios.get(`https://diploma-project-w89i.onrender.com/login?email=${obj.email}`);
		if(obj.email === data.email) {
			setisFreelogin("User with this email already exists");
		} else {
			await axios.post('https://diploma-project-w89i.onrender.com/registration', obj);
			setIsSubmited(false);
		}

		

	}

	return (
		<div className='text-center pb-4'>
			<h4 className="mt-4">Registration</h4>

			{
				isSubmited ? <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
				<span style={{color: 'red'}}>{isFreeLogin}</span><br />
				<input {...register('name', { required: true, minLength: 4, maxLength: 20, pattern: /^[A-Za-z]+$/i })} 
					name="name" placeholder="Name" /><br />
				<input {...register('email', { required: true })} className="mt-3" name="email" placeholder="Email" /><br />
				<input {...register('phone', { required: true })} className="mt-3" name="phone" placeholder="Phone" /><br />
				<input {...register('password', { required: true, minLength: 6 })} className="mt-3" name="password" type="password" placeholder="Password" /><br />
				<button type="submit" className={styles.submitBtn}>Submit</button> 
			</form> :
				<>
					<h3>Thank you for registration!</h3>
					<h3>Please, <Link to="/login">Login</Link></h3>
				</>				
			}

		</div>
	)
}

export default Registration;