import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";

import styles from './Orders.module.scss';

function Orders() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {

		/*(async () => {
			const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/orders');
			console.log(data)

		})();*/

		async function getOrders() {
			try {
				const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/orders');
				setOrders(data.map((obj) => obj.cards).flat());
				setIsLoading(false);
			} catch (error) {
				alert('Failed to request the orders');

			}

		};
		getOrders();

	}, [])

	async function onRemoveOrders(id) {
		
		try {
			await axios.delete(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/orders/${id}`);
			setOrders([]);

		} catch (error) {
			alert('Failed to remove from Orders!')

		}
		
	}
	
	return (<div className="content p-5">
		<h3>MY ORDERS:</h3>

		<div className="d-flex row">
			{isLoading ? [...Array(12)].map(card => {
				return <Card
					loading={isLoading} />
			}) : orders.map(card => {

				return <Card
					{...card}
					key={card.id}
					loading={isLoading}
					orders={orders}
					setOrders={setOrders} />



			})}
		</div>
				
		<button className={styles.removeOrdersBtn} onClick={() => onRemoveOrders(1)}>CANCEL ORDERS</button>
		<h4 className="mt-4">Shipping Details</h4>
		<form className="mt-3" action="https://64440fc9466f7c2b4b60d1da.mockapi.io/items/shipping" method="post">
			<div>
				<label for="country">Country</label><br />
				<input name="country" id="country" placeholder="Ukraine" />
			</div>
			<div>
				<label  className="mt-3" for="city">City</label><br />
				<input name="city" id="city" placeholder="Kyiv" />
			</div>
			<div>
				<label  className="mt-3" for="address">Street, building, apartment</label><br />
				<input name="address" id="address" />
			</div>
			<div>
				<label  className="mt-3" for="fullName">Full Name</label><br />
				<input name="fullName" id="fullName" />
			</div>
			<div>
				<label  className="mt-3" for="phone">Phone</label><br />
				<input name="phone" id="phone" placeholder="+380" />
			</div>
			<div>
				<label  className="mt-3" for="size">What sizes of the sneakers do you need?</label><br />
				<input name="size" id="size" placeholder="42-size – 2 pairs" />
			</div>
			<div>
				<button className={styles.submitBtn}>SUBMIT</button>
			</div>
		</form>

	</div>
	)

}

export default Orders;