import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import { setTokenItem } from '../redux/slices/tokenSlice';
import { setUser } from "../redux/slices/userSlice";
import ReCAPTCHA from 'react-google-recaptcha';

import 'react-phone-number-input/style.css';
import stylesReg from './Registration.module.scss';
import styles from './Orders/Orders.module.scss';

function Registration({ url }) {
	const { register,
			handleSubmit,
			formState: { errors },
			control } = useForm({
							mode: "onBlur"
						});
	const [isFreeLogin, setisFreelogin] = useState("");
	const [recaptchaToken, setRecaptchaToken] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	console.log(recaptchaToken);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
      };


	async function onSubmit(user) {
		try {
		const response = await axios.post(`${url}api/auth/register`, JSON.stringify(user), {headers: { 'Content-Type': 'application/json' }});
		const data = response.data;
		dispatch(
			setTokenItem({
			userId: data.userId,
			access_token: data.access_token,
			exp: jwtDecode(data.access_token).exp,
			})
		);
		const responseUser = await axios.get(`${url}user/${data.userId}`, {
			headers: { Authorization: `Bearer ${data.access_token}` },
		});
		const dataUser = responseUser.data;
		dispatch(setUser(dataUser));
		navigate('/');
			
		} catch (err) {
			if (!err?.response) {
				setisFreelogin('No Server Response');
			  } else if (err.response?.status === 409) {
				setisFreelogin('Username Taken');
			  } else {
				setisFreelogin('Registration Failed');
			  }			
		}		
	}

	return (
		<div className='text-center pb-4'>
			<h4 className="mt-4">Registration</h4>
			<form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
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
			</form>
			<div className="mt-2">
				<ReCAPTCHA
					sitekey="6Lfm6SMqAAAAAEzS4d3i6RtK5cNHpyaaTRQazdKP"
					onChange={handleRecaptchaChange}
					theme="light"
				/>

            </div>
		</div>
	)
}

export default Registration;