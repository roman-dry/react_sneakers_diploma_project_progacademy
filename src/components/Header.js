import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import { removeUser } from "../redux/slices/userSlice";
import { removeToken } from "../redux/slices/tokenSlice";
import { getLocalStorage } from '../utils/localStorage';
import { AppContext } from '../App';
import axios from 'axios';

function Header( {onClickCart, setCardCart, currentUser, url} ) {

	const { cardCart, setFavorites } = useContext(AppContext);
	const navigate = useNavigate();
    const token = useSelector((state) => state.tokenReducer.item.access_token);
	const exp = getLocalStorage("token").exp;
    const dispatch = useDispatch();
    const sumOfOrders = cardCart.reduce((acc, card) => {
		return acc + Number(card.totalPrice)}, 0);
	const visiblePromotionSum = sumOfOrders >= 1000 ? sumOfOrders.toFixed(2) : (sumOfOrders * 1.05).toFixed(2);

	
	async function getLogout() {
		let time = new Date().getTime();
		time = time / 1000;
		if (exp && exp < time) {
			localStorage.removeItem("user");
			dispatch(removeUser()); 
			dispatch(removeToken());
			setCardCart([]);
			setFavorites([]);
			return navigate('/');
		} else {
			try { 
		
				await axios.post(`${url}api/auth/logout`,  JSON.stringify({}),
					{headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json'
						}          
					});
				dispatch(removeUser()); 
				dispatch(removeToken());
				setCardCart([]);
				setFavorites([]);
				return navigate('/');			
	
			} catch {
				alert('Fail logout');
			}	

		}
		
		
		

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
				currentUser.name ? <div className='grettings'><h6 className='pb-0 ml-3 text-center'>Hello, {currentUser.name}!</h6>
				<div className='text-center'>
					<button className='ml-3 btn' onClick={() => getLogout()}><span className='logoutBtn'><b>Logout</b></span></button></div>
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

				{
					currentUser.name ? <select className="text-center selectBlock ml-3" onClick={onRedirectToOrdersPage}>
					<option value="/">Info</option>
					{currentUser.role === 'USER' ? <option value="/orders">My orders</option> : ''}
					{currentUser.role === 'USER' ? <option value="/shipping">My shipping</option> : ''}
					{currentUser.role === 'ADMIN' ? <option value="/admin">Add product</option> : <option value="/user">Edit profile</option>}
				</select> : ''

				}				

			</ul>	
						
		</header>);

}

export default Header;