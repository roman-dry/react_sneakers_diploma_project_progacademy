import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

function Header( {onClickCart, userViewName, isLoginTrue, setIsLoginTrue, setUser, setCardCart} ) {

	const { cardCart } = useContext(AppContext);
	const navigate = useNavigate();
    const sumOfOrders = cardCart.reduce((acc, card) => {
		return acc + Number(card.totalPrice)}, 0);
	const visiblePromotionSum = sumOfOrders >= 1000 ? sumOfOrders.toFixed(2) : (sumOfOrders * 1.05).toFixed(2);

	function getLogout() {
		setIsLoginTrue(false)
		setUser({});
		setCardCart([])

	}

	function onRedirectToOrdersPage(event) {
		return navigate(event.target.value)

	}

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

			{
				isLoginTrue ? <div className='grettings'><h6 className='pb-0 ml-3 text-center'>Hello, {userViewName}!</h6>
				<div className='text-center'>
					<button className='ml-3 btn' onClick={getLogout}><span className='logoutBtn'><b>Logout</b></span></button></div>
				</div> : 
					<div className='link-login text-center'><Link to="/login">Login</Link></div>
			}			
			
			<ul className="d-flex list-unstyled" role='button'>
				<li>
					<div className="d-flex" onClick={onClickCart}>
						<img className="imgCart" width="20px" src="img/cart2.svg" alt="cart" />
						<span className="ml-4">${sumOfOrders ? visiblePromotionSum : 0}</span>
					</div>
					
				</li>
				<Link to="/favorites">
					<button className="background-none ml-3">
						<img width="20px" src="img/heart-unliked.svg" alt="Favorite button" />
					</button>
				</Link>
				
				<select className="text-center selectBlock ml-3" onClick={onRedirectToOrdersPage}>
					<option value="/">Info</option>
					<option value="/orders">My orders</option>
					<option value="/shipping">My shipping</option>
					<option value="/user">Edit profile</option>
				</select>

			</ul>	
						
		</header>);

}

export default Header;