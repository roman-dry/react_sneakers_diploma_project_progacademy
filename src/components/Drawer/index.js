import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Info from '../Info';
import { AppContext } from '../../App';

import styles from './Drawer.module.scss';

function Drawer({ onClickCloseCart, onClickMinus, opened, user, url }) {

	const [isOrderCompleted, setIsOrderCompleted] = useState(false);
	const [orderId, setOrderId] = useState(null);
	const { cardCart, setCardCart } = useContext(AppContext);
	const navigate = useNavigate();
	const sumOfOrders = cardCart.reduce((acc, card) => {
		return acc + Number(card.totalPrice)
	}, 0);		

	async function onClickOrder() {	
			let orderDescription = 	cardCart.reduce((acc, card) => {
				let cardCountWord;
				if(card.count === 1) {
					cardCountWord = 'pair'
				} else {
					cardCountWord = 'pairs'
				}
				return acc + card.title + " - " + card.count + " " + cardCountWord + "  "
				
				}, "")
			const newOrder = {
				"user_id": user.id,
				"status": "inactive",
				"orderDescription": orderDescription,
				"totalSum": sumOfOrders >= 1000 ? sumOfOrders : sumOfOrders * 1.05
			};

			async function removeUsersCart() {
				await axios.delete(`${url}cart?user_id=${user.id}`);
			}

			try {
			
				const { data } = await axios.post(`${url}orders`, newOrder);
				setOrderId(data.id)
				setIsOrderCompleted(true);
				setCardCart([]);
				removeUsersCart();				
	
			} catch (error) {
				alert('Failed to create an order!')
	
			}	
	}		

	async function onCountPlus(card) {		
				
		try {
		
			[...cardCart].map((item) => {
				if (Number(item.parent_id) === Number(card.parent_id)) {
					
					++item.count;
					item.totalPrice = item.totalPrice + Number(item.price);				
								
					return item;
				}			
			})

			const cart = {
				"title": card.title,
				"price": card.price,
				"imageURL": card.imageURL,
				"count": card.count,
				"totalPrice": card.totalPrice,
				"parent_id": card.parent_id,
				"user_id": user.id
			}

			const { data } = await axios.put(`${url}cart`, cart);
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
					if (Number(item.parent_id) === Number(card.parent_id)) {
						
						--item.count;
						item.totalPrice = item.totalPrice - Number(item.price);				
									
						return item;
					}			
				})

				const cart = {
					"title": card.title,
					"price": card.price,
					"imageURL": card.imageURL,
					"count": card.count,
					"totalPrice": card.totalPrice,
					"parent_id": card.parent_id,
					"user_id": user.id
				}
	
				const { data } = await axios.put(`${url}cart`, cart);
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

	function onRedirectToOrder() {
		setIsOrderCompleted(false);
		onClickCloseCart();
		return navigate('/orders');
	}

	return (<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
		<div className={styles.drawer}>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h4 style={{color: 'blue'}}>LuChoice Cart</h4>
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
									<button onClick={() => onClickMinus(card.parent_id)} className="removeBtn">
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
							<b> ${sumOfOrders >= 1000 ? sumOfOrders : (sumOfOrders * 1.05).toFixed(2)}</b>
						</li>
						<li className="d-flex align-items-end">
							<span>Fee 5%: </span>
							<div></div>
							<b> ${sumOfOrders >= 1000 ? 0 : (sumOfOrders / 20).toFixed(2)}</b>
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
						description={isOrderCompleted ? `Order id-${orderId} is ready to ship` : "Add at least one pair of sneakers"}
						confirm_button={isOrderCompleted && <button onClick={onRedirectToOrder} 
							className={styles.totalSumButton}>CONFIRM ORDER</button>}
						image={isOrderCompleted ? "img/order_completed.png" : "img/basket.svg"} />)}

		</div>
	</div>);
}

export default Drawer;