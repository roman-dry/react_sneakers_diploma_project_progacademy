import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

function Header( {onClickCart} ) {

	const { cardCart } = useContext(AppContext);
   const sumOfOrders = cardCart.reduce((acc, card) => {
		return acc + Number(card.totalPrice)}, 0);

	return (<header className="justify-content-between align-items-center p-5">
			<Link to="/">
				<div className="headerLeft align-items-center">
					<img src="img/logo.png" alt="logo" className="mr-2" />
					<div className="headerInfo">
						<h3 className="m-0">LUCHOICE SNEAKERS</h3>
						<p className="m-0">The best sneakers store</p>
					</div>
				</div>
			</Link>
			
			<ul className="d-flex list-unstyled" role='button'>
				<li>
					<div className="d-flex" onClick={onClickCart}>
						<img width="20px" src="img/cart2.svg" alt="cart" />
						<span className="ml-4">${sumOfOrders ? (sumOfOrders * 1.05).toFixed(2) : 0}</span>
					</div>
					
				</li>
				<Link to="/favorites">
					<button className="background-none ml-3">
						<img width="20px" src="img/heart-unliked.svg" alt="Favorite button" />
					</button>
				</Link>

				<Link to="/orders">
					<li className="ml-4">
						<img width="20px" src="img/user_icon.png" alt="user_icon" />

					</li>
				</Link>
				
				
			</ul>				
		</header>);

}

export default Header;