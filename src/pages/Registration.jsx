import React, { useState } from 'react';

import styles from './Orders/Orders.module.scss';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'react-phone-number-input/style.css';

function Registration({ url }) {
	const { register,
			handleSubmit,
			reset,
			formState: { errors },
			control } = useForm({
							mode: "onBlur"
						});
	const [isSubmited, setIsSubmited] = useState(true)
	const [isFreeLogin, setisFreelogin] = useState("");

	async function onSubmit(obj) {
		const { data } = await axios.get(`${url}login?email=${obj.email}`);
		if(obj.email === data.email) {
			setisFreelogin("User with this email already exists");
		} else {
			await axios.post(`${url}registration`, obj);
			setIsSubmited(false);
		}
		reset();
	}

	return (
		<div className='text-center pb-4'>
			<h4 className="mt-4">Registration</h4>

			{
				isSubmited ? <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
				<span style={{color: 'red'}}>{isFreeLogin}</span><br />
				<input {...register('name', { required: true, minLength: 4, maxLength: 20, pattern: /^[A-Za-z]+$/i })} 
					name="name" placeholder="Name" /><br />
				<input {...register('email', 
					{ required: true, 
					pattern: {
						value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						message: "invalid email address"
					} })} 
					className="mt-3" name="email" placeholder="Email" /><br />
				{/* <input {...register('phone', { required: true })} className="mt-3" name="phone" placeholder="Phone" /> */}
				<div>
					<label htmlFor="phone">Phone Number</label>
					<Controller
					name="phone"
					control={control}
					rules={{ required: true }}
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
					{errors.phone && <p className="error-message">Invalid Phone</p>}
				</div>
				<br />
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