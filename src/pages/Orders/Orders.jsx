import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from "axios";

import styles from './Orders.module.scss';

function Orders({ currentUser, setTotalSumOfOrders, orders, setOrders, setTotalSumDescription, url }) {
	
	const navigate = useNavigate();
	const token = useSelector((state) => state.tokenReducer.item.access_token);
	const totalSumOfOrders = orders.reduce((acc, order) => {
		return acc + Number(order.totalSum)
	}, 0);
	setTotalSumOfOrders(totalSumOfOrders);
	const totalSumDescription = orders.reduce((acc, order) => {
		return acc + order.orderDescription + "  "
	}, "");
	setTotalSumDescription(totalSumDescription);	

	useEffect(() => {
		async function getOrders() {
			if(currentUser.name) {
				try {
					const { data } = await axios.get(`${url}orders/${currentUser.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					  });
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
			await axios.delete(`${url}orders/${id}`,
			{headers: {
				 Authorization: `Bearer ${token}`
			 }          
			});
			setOrders((prev) => prev.filter((item) => item.id !== id));

		} catch (error) {
			alert('Failed to remove from Orders!')

		}
		
	}
	
	return (<div className="content p-5">
		{
			orders.length ? <div><h3 className="mb-3">MY ORDERS:</h3>

			{
				orders.map(order => {
					const listOfOrdersDescription = order.orderDescription.split("  ");

					return <div key={order.id} className="mb-3">
						<h6>Order # {order.id}</h6>
						{
							listOfOrdersDescription.map(item => {
								return <ul>
									<li key={item.id} style={{listStyleType:'none'}}>{item}</li>
								</ul>
							})
						}
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