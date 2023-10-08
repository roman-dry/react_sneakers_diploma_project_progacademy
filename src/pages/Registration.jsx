import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'react-phone-number-input/style.css';
import stylesReg from './Registration.module.scss';
import styles from './Orders/Orders.module.scss';

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
				<input {...register('name', { required: true, pattern: /^[A-Za-z]+$/i })} 
					name="name" placeholder="Name" /><br />
				<input {...register('email', 
					{ required: true, 
					pattern: {
						value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					} })} 
					className="mt-3" name="email" placeholder="Email" id="email" /><br />
				{errors["email"] && (
						<p className={stylesReg.colorError} >Invalid email address!</p>
				)}
				<div className={stylesReg.phoneController}>
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
				</div>
				<br />
				<input {...register('password', { required: true, minLength: 6 })} style={{marginTop: -5}} name="password" type="password" placeholder="Password" id="password" /><br />
				{errors["password"] && (
						<p className={stylesReg.colorError} >Password is too short!</p>
				)}
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