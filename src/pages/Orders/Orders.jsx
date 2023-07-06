import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import styles from './Orders.module.scss';

function Orders( {user, isLoginTrue, setTotalSumOfOrders, orders, setOrders, setTotalSumDescription} ) {
	
	const navigate = useNavigate();
	const totalSumOfOrders = orders.reduce((acc, order) => {
		return acc + Number(order.totalSum)
	}, 0);
	setTotalSumOfOrders(totalSumOfOrders);
	const totalSumDescription = orders.reduce((acc, order) => {
		return acc + order.orderDescription + " "
	}, "");
	setTotalSumDescription(totalSumDescription);	
	

	useEffect(() => {

		async function getOrders() {
			if(isLoginTrue) {
				try {
					const { data } = await axios.get(`https://diploma-project-w89i.onrender.com/orders/${user.id}`);
					setOrders(data);
				} catch (error) {
					alert('Failed to request the orders');	
				}				
			} else {
				return navigate('/login')
			};
		};
		getOrders();

	}, [])

	async function onRemoveOrder(id) {
		
		try {
			await axios.delete(`https://diploma-project-w89i.onrender.com/orders/${id}`);
			setOrders((prev) => prev.filter((item) => Number(item.id) !== Number(id)));

		} catch (error) {
			alert('Failed to remove from Orders!')

		}
		
	}
	
	return (<div className="content p-5">
		{
			orders.length ? <div><h3 className="mb-3">MY ORDERS:</h3>

			{
				orders.map(order => {
					return <div key={order.id} className="mb-3">
						<h6>Order # {order.id}</h6>
						<p style={{width: '500px'}}>{order.orderDescription}</p>
						<button className={styles.removeOrdersBtn} onClick={() => onRemoveOrder(order.id)}>CANCEL ORDER</button>
					</div>
				})
			}<Link to="/shipping"><button className={styles.submitBtn}>CONFIRM ALL</button></Link> </div> : <div className=" mb-5 text-center">
				<h3 className="mb-2">No new orders yet</h3>
				<Link to="/"><h4 className="navbar-brand">Choose sneakers</h4></Link>
			</div>
		}		
		
	</div>
	)

}

export default Orders;