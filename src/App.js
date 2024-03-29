import Header from "./components/Header";
import Drawer from "./components/Drawer/index.js";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Shipping from "./pages/Shipping";
import Orders from "./pages/Orders/Orders";
import React, { useState, useEffect, createContext } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminEdit from "./pages/AdminEdit";
import AdminDelete from "./pages/AdminDelete";
import UserEdit from "./pages/UserEdit";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "./redux/slices/userSlice";
import { removeToken } from "./redux/slices/tokenSlice";
import { getLocalStorage } from "./utils/localStorage.js";
export const AppContext = createContext({});

function App() {
	
	const [cards, setCards] = useState([]);
	const [cardCart, setCardCart] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalSumOfOrders, setTotalSumOfOrders] = useState(0);
	const [totalSumDescription, setTotalSumDescription] = useState("");
	const [orders, setOrders] = useState([]);
	const currentUser = useSelector((state) => state.userReducer.user);
	const token = useSelector((state) => state.tokenReducer.item.access_token);
	const exp = getLocalStorage("token").exp;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	//const url = 'https://diploma-project-w89i.onrender.com/';
	const url = 'http://localhost:8080/';
	

	useEffect(() => {
		
		async function fetchData() {
			try {
				setIsLoading(true)
				const cardsResponse = await axios.get(url);
				setIsLoading(false);
				setCards(cardsResponse.data);
				
				let time = new Date().getTime();
				time = time / 1000;
				if (exp && exp < time) {
					localStorage.removeItem("user");
					dispatch(removeUser()); 
					dispatch(removeToken());
					setCardCart([]);
					setFavorites([]);
					return navigate('/');
				}
				if (currentUser.role === 'USER') {
					const cartResponse = await axios.get(`${url}cart?user_id=${currentUser.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					  });
					const favoriteResponse = await axios.get(`${url}favorite?user_id=${currentUser.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					  });
					setCardCart(cartResponse.data);
					setFavorites(favoriteResponse.data);
				}

			} catch (error) {
				alert('Error requesting data')
			}

		}

		fetchData();

	}, []);
	
	async function addToCart(card) {

		if(currentUser.name) {
			try {
				const cart = {
					"title": card.title,
					"price": card.price,
					"imageURL": card.imageURL,
					"count": 1,
					"totalPrice": card.price,
					"parent_id": card.parent_id,
					"user_id": currentUser.id
				}
	
				const findCart = cardCart.find((item) => item.parent_id === card.parent_id);
				if (findCart) {
					setCardCart((prev) => prev.filter((itemCard) => itemCard.parent_id !== card.parent_id))
					await axios.delete(`${url}carted?user_id=${currentUser.id}&parent_id=${findCart.parent_id}`,
					{headers: {
						 Authorization: `Bearer ${token}`
					 }          
					});
				} else {
					
					const { data } = await axios.post(`${url}cart`, JSON.stringify(cart),
					{headers: {
						 Authorization: `Bearer ${token}`,
						 'Content-Type': 'application/json'
					 }          
					});
					setCardCart(prev => [...prev, cart]);
					setCardCart((prev) => prev.map(cart => {
						if (cart.parent_id === data.parent_id) {
							return {
								...cart,
								id: data.id
							}
						}
						return cart;
					}));
					
				}
	
			} catch (error) {
				alert('Error add to cart');
	
			}

		} else {
			return navigate('/login')
		};
	}

	async function onClickMinus(id) {

		try {
			await axios.delete(`${url}cart?user_id=${currentUser.id}&parent_id=${id}`,
			{headers: {
				 Authorization: `Bearer ${token}`
			 }          
			});
			setCardCart(prev => prev.filter(card => card.parent_id !== id));
		} catch (error) {
			alert('Failed to remove from cart');
		}
	}

	async function addToFavorites(card) {

		if(currentUser.name) {
			try {
				const cardFav = {
					"title": card.title,
					"price": card.price,
					"imageURL": card.imageURL,
					"count": 1,
					"totalPrice": card.price,
					"parent_id": card.parent_id,
					"user_id": currentUser.id
				}
	
				const findCart = favorites.find((item) => item.parent_id === card.parent_id);
				if (findCart) {
					setFavorites((prev) => prev.filter((itemCard) => itemCard.parent_id !== card.parent_id))
					await axios.delete(`${url}favorite/${findCart.parent_id}`,
					{headers: {
						 Authorization: `Bearer ${token}`
					 }          
					});
				} else {
					
					const { data } = await axios.post(`${url}favorite`, JSON.stringify(cardFav),
					{headers: {
						 Authorization: `Bearer ${token}`,
						 'Content-Type': 'application/json'
					 }          
					});
					setFavorites(prev => [...prev, data]);
										
				}
	
			} catch (error) {
				alert('Error add to favorites');
	
			}

		} else {
			return navigate('/login')
		};		
	}

	async function removeFromFavorites(id) {
		let idFav = null;
		favorites.map(card => {
			if(card.user_id === currentUser.id && card.parent_id === id) {
				idFav = card.parent_id;
			}
			return card
		})
		try {
			await axios.delete(`${url}favorite/${idFav}`,
			{headers: {
				 Authorization: `Bearer ${token}`
			 }          
			});
			setFavorites(prev => prev.filter(card =>  card.parent_id !== id ))
		} catch (error) {
			alert('Failed to remove from Favorited')
		}

	}	

	function onChangeInputValue(event) {
		setSearchValue(event.target.value)
	}

	function onRemoveSearch() {
		setSearchValue("")
	}

	function isCardAdded(id) {
		return cardCart.some(item => item.parent_id === id)
	}

	function isFavorited(id) {
		return favorites.some(item => item.parent_id === id)
	}

	return (

		<AppContext.Provider key={currentUser.id} value={{
			cards, cardCart, favorites, isCardAdded, isFavorited, setOpenDrawer,
			setCardCart, addToCart, currentUser, setFavorites
		}}>
			<div className="wrapper">
				<Drawer
					onClickCloseCart={() => setOpenDrawer(false)}
					cards={cardCart}
					onClickMinus={onClickMinus}
					opened={openDrawer}
					currentUser={currentUser}
					url={url} />

				<Header 
					onClickCart={() => setOpenDrawer(true)}
					setCardCart={setCardCart}
					currentUser={currentUser}
					url={url} />				

					<Routes>
						< Route path="/" element={<Home
							cards={cards}
							searchValue={searchValue}
							onChangeInputValue={onChangeInputValue}
							onRemoveSearch={onRemoveSearch}
							addToCart={addToCart}
							onClickMinus={onClickMinus}
							addToFavorites={addToFavorites}
							removeFromFavorites={removeFromFavorites}
							isLoading={isLoading}
						/>}
							exact />

						<Route path="/favorites" element={<Favorites
							addToFavorites={addToFavorites}
							removeFromFavorites={removeFromFavorites}
							addToCart={addToCart}
							 />} exact />

						<Route path="/orders" element={<Orders 
							currentUser={currentUser}
							setTotalSumOfOrders={setTotalSumOfOrders}
							orders={orders}
							setOrders={setOrders}
							setTotalSumDescription={setTotalSumDescription}
							url={url} />} exact />

						<Route path="/shipping" element={ <Shipping
							totalSumOfOrders={totalSumOfOrders}
							currentUser={currentUser}
							setOrders={setOrders}
							totalSumDescription={totalSumDescription}
							url={url}  /> } exact />

						<Route path="/registration" element={ <Registration url={url} /> } exact />

						<Route path="/login" element={ <Login 
							currentUser={currentUser}
							setCardCart={setCardCart}
							setFavorites={setFavorites}
							url={url} /> } exact />

						<Route path="/admin" element={ <Admin url={url} currentUser={currentUser} /> } exact />
						<Route path="/edit" element={ <AdminEdit url={url} currentUser={currentUser} /> } exact />
						<Route path="/remove" element={ <AdminDelete url={url} currentUser={currentUser} /> } exact />
						<Route path="/user" element={ <UserEdit url={url} currentUser={currentUser} /> } exact />
						
					</Routes>				

			</div>

		</AppContext.Provider>
	);
}

export default App;