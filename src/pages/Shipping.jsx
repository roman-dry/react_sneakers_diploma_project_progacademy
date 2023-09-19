import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from "axios";

import styles from './Orders/Orders.module.scss';

function Shipping({ user, totalSumOfOrders,	isLoginTrue, setOrders, totalSumDescription, url }) {
	const [shippings, setShippings] = useState([]);
	const [isSubmited, setIsSubmited] = useState(true);
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

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
					<input {...register('country', { required: true })} name="country" placeholder="Country" /><br />
					<input {...register('city', { required: true })} className="mt-3" name="city" placeholder="City" /><br />
					<input {...register('address', { required: true })} className="mt-3" name="address" placeholder="Address" /><br />
					<input {...register('fullname', { required: true})} className="mt-3" name="fullname" placeholder="Fullname" /><br />
					<input {...register('phone', { required: true })} className="mt-3" name="phone" placeholder="+380" /><br />
					<input {...register('size', { required: true })} className="mt-3" name="size" placeholder="42-size – 2 pairs" /><br />
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