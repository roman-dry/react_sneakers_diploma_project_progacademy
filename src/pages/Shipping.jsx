import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import axios from "axios";

import styles from './Orders/Orders.module.scss';
import 'react-phone-number-input/style.css';
import stylesReg from './Registration.module.scss';

function Shipping({ user, totalSumOfOrders,	isLoginTrue, setOrders, totalSumDescription, url }) {
	const [shippings, setShippings] = useState([]);
	const [isSubmited, setIsSubmited] = useState(true);
	const [countries, setCountries] = useState([]);
	const navigate = useNavigate();
	const { register,
		handleSubmit,
		reset,
		formState: { errors },
		control } = useForm({
						mode: "onBlur"
					});

	useEffect(() => {
		
		async function getShipping() {
			if(isLoginTrue) {
				try {
					const { data } = await axios.get(`${url}shippings/${user.id}`);
					setShippings(data);					
				} catch (error) {
					alert('Failed to get Shipping!')					
				}				
			} else {
				return navigate('/login')
			};			
			
		}
	
		getShipping();		

	}, [])

	useEffect(() => {
		const data = require('./CountryData.json');
		setCountries(data);
	}, [])

	async function onRemoveShipping(id) {
		
		try {
			await axios.delete(`${url}shippings/${id}`);
			setShippings((prev) => prev.filter((shipping) => Number(shipping.id) !== Number(id)));

		} catch (error) {
			alert('Failed to remove from Shippings!')

		}
		
	}

	async function onSubmit(data) {
		await axios.post(`${url}shippings`, data);
		setIsSubmited(false);
		await axios.patch(`${url}orders?user_id=${user.id}&status=active`);
		setOrders([]);
		reset();
	}	
		

	return (<div className="p-4">
		
		{
			shippings.length ? <div><h3 className="mb-3">DELIVERY DETAILS:</h3>

			{
				shippings.map(shipping => {
					return <div key={shipping.id} className="mb-3">
						<h6 className="mb-2">Shipping # {shipping.id}</h6>
						<li>Country: {shipping.country}</li>
						<li>City: {shipping.city}</li>
						<li>Address: {shipping.address}</li>
						<li>Fullname: {shipping.fullName}</li>
						<li>Phone: {shipping.phone}</li>
						<li>Comment: {shipping.size}</li>
						<h6 className="mt-2">{shipping.totalDesc} is(are) ready for shipping</h6>
						<b>Total amount due: ${shipping.total_sum}</b><br />
						<button className={styles.removeOrdersBtn} onClick={() => onRemoveShipping(shipping.id)}>CANCEL SHIPPING</button>
					</div>
				})
			} </div> : <div className=" mb-5 text-center">				
				<Link to="/"><h5 className="navbar-brand">Choose new sneakers</h5></Link>
			</div>
		}
		{isSubmited ? <div><h4 className="mt-4">Shipping Details</h4>
				<form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
					<select className={stylesReg.selectCountry} {...register("country", { required: 'Please, select country' })}>
						<option value=''>--Select Country--</option>
						{
							countries.map(el => {
								return <option key={el.country}>{el.country}</option>
							})
						}
					</select><br />
				
					{
						errors.country && <><span className={stylesReg.colorError}>{errors.country.message}</span><br /></>
					}
					
					<input {...register('city', { required: true, pattern: /^[A-Za-z]+$/i })} className="mt-3" name="city" placeholder="City" /><br />

					{errors["city"] && (
						<p className={stylesReg.colorError} >Blank field!</p>
					)}

					<input {...register('address', { required: true })} className="mt-3" name="address" placeholder="Address" /><br />

					{errors["address"] && (
						<p className={stylesReg.colorError} >Blank field!</p>
					)}
					<input {...register('fullname', { required: true })} className="mt-3" name="fullname" id="fullname" placeholder="Fullname" /><br />

					{errors["fullname"] && (
						<p className={stylesReg.colorError} >Blank field!</p>
					)}

					<div className={stylesReg.phoneControllerShip}>
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
					<input {...register('size', { required: true, maxLength: 100 })} className="mt-3" name="size" id="size" placeholder="42-size – 2 pairs" /><br />

					{errors["size"] && (
						<p className={stylesReg.colorError} >Maximum 100 symbols!</p>
					)}
					
					<input {...register('totalDesc', { required: true })} className="mt-3" name="totalDesc" type="hidden" 
						value={totalSumDescription} /><br />								
					<button type="submit" className={styles.submitBtn}>Submit</button> 
					<input {...register('user_id', { required: true })} className="mt-3" name="user_id" type="hidden" value={user.id} /><br />
					<input {...register('total_sum', { required: true })} className="mt-3" name="total_sum" type="hidden" 
						value={totalSumOfOrders} /><br />
				</form></div> :
				<div className="text-center">
					<h3>Shipping started!</h3>
				</div>				
		}
		
	</div>

	);
}

export default Shipping;