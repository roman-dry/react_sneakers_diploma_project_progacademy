import React, { useContext, useState } from 'react';
import axios from 'axios';

import Info from '../Info';
import { AppContext } from '../../App';

import styles from './Drawer.module.scss';

function Drawer({ onClickCloseCart, onClickMinus, opened }) {

	//const [count, setCount] = useState(1);
	const [isOrderCompleted, setIsOrderCompleted] = useState(false);
	const [orderId, setOrderId] = useState(null);
	const { cardCart, setCardCart } = useContext(AppContext);
	const sumOfOrders = cardCart.reduce((acc, card) => {
		return acc + Number(card.totalPrice)
	}, 0);

	async function onClickOrder() {
		try {
			const { data } = await axios.post('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/orders',
				{ cards: cardCart });
			setOrderId(data.id)
			setIsOrderCompleted(true);
			setCardCart([]);
			//await axios.put('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart', []);

		} catch (error) {
			alert('Failed to create an order!')

		}

	}

	

	async function onCountPlus(card) {		
		
		try {
		
			[...cardCart].map((item) => {
				if (Number(item.id) === Number(card.id)) {
					
					++item.count;
					item.totalPrice = item.totalPrice + Number(item.price);				
								
					return item;
				}			
			})

			const { data } = await axios.put(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart/${card.id}`, card);
			setCardCart((prev) => prev.map(item => {
				if(item.id === data.id) {
					return {
						...item,
						count: data.count,
						totalPrice: data.totalPrice
					}
				}
				return item;
			}));
				
			
			
		} catch (error) {
			alert('Failed Put-request')
			
		}
		

	}

	async function onCountMinus(card) {
		if (card.count > 1) {
			try {		
				[...cardCart].map((item) => {
					if (Number(item.id) === Number(card.id)) {						
						--item.count;
						item.totalPrice = item.totalPrice - Number(item.price);									
						return item;
					}			
				})
	
				const { data } = await axios.put(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart/${card.id}`, card);
				setCardCart((prev) => prev.map(item => {
					if(item.id === data.id) {
						return {
							...item,
							count: data.count,
							totalPrice: data.totalPrice
						}
					}
					return item;
				}));
					
				
				
			} catch (error) {
				alert('Failed Put-request')
				
			}
		}
	}

	// async function onClickMinus(id) {
	// 	try {
	// 		axios.delete(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart/${id}`)
	// 		//const newCart = [...cardCart].filter((card) => card.id !== id);
	// 		await setCardCart((prev) => prev.filter(card => card.id !== id));

	// 	} catch (error) {
	// 		alert('Failed to remove from Cart!')

	// 	}

	// }
	return (<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
		<div className={styles.drawer}>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h4><ins>LuChoice Cart</ins></h4>
				</div>
				<button className={`${styles.closeBtn} + ' mb-1'`} onClick={onClickCloseCart} >
					<img className={styles.rotatePlus} width="10px" src="img/plus_button.svg" alt="plus-button" />
				</button>
			</div>
			{cardCart.length > 0 ?
				<>
					<div className={styles.itemsCart}>
						{cardCart.map(card => {
							return <div key={card.id} className={styles.itemCart}>
								<div className="d-flex justify-content-between align-items-center">
									<img className="mr-2" width="70px" src={card.imageURL} alt="Sneakers 1" />
									<div className="ml-2">
										<p className="m-auto">{card.title}</p>
										<span>PRICE: </span>
										<b>${card.price}</b>
									</div>
									<button onClick={() => onClickMinus(card.id)} className="removeBtn">
										<img className="rotate-plus" width="10px" src="img/plus_button.svg" alt="plus-button" />
									</button>
								</div>
								<div className='text-center'>
									<button onClick={() => onCountMinus(card)} className={styles.opacityBtn}>-</button> 
									<span>{card.count}</span>
									<button onClick={() => onCountPlus(card)} className={styles.opacityBtn}>+</button>
								</div>
							</div>

						})}

					</div>
					<ul className={`${styles.totalSumBlock} + ' pt-2 pl-0 mt-1'`}>
						<li className="d-flex align-items-end">
							<span>Total including fee: </span>
							<div></div>
							<b> ${(sumOfOrders * 1.05).toFixed(2)}</b>
						</li>
						<li className="d-flex align-items-end">
							<span>Fee 5%: </span>
							<div></div>
							<b> ${(sumOfOrders / 20).toFixed(2)}</b>
						</li>
					</ul>
					<div className="text-center">
						<button onClick={onClickOrder} className={`${styles.totalSumButton}`}>
							<b>Create an order</b>
						</button>
					</div>
				</> : (
					<Info
						title={isOrderCompleted ? "Order completed" : "The cart is still empty"}
						description={isOrderCompleted ? `Item id-${orderId} is ready to ship` : "Add at least one pair of sneakers"}
						image={isOrderCompleted ? "img/order_completed.png" : "img/basket.svg"} />)}

		</div>
	</div>);
}

export default Drawer;
// onClick={() => onCountMinus(card.id)}