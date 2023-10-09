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

export const AppContext = createContext({});

function App() {
	
	const [cards, setCards] = useState([]);
	const [cardCart, setCardCart] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [userViewName, setUserViewName] = useState('');
	const [isLoginTrue, setIsLoginTrue] = useState(false);
	const [user, setUser] = useState({});
	const [totalSumOfOrders, setTotalSumOfOrders] = useState(0);
	const [totalSumDescription, setTotalSumDescription] = useState("");
	const [orders, setOrders] = useState([]);
	const navigate = useNavigate();
	const url = 'https://diploma-project-w89i.onrender.com/';
	//const url = 'http://localhost:8080/';

	useEffect(() => {
		
		async function fetchData() {			

			try {

				setIsLoading(true)
				const cardsResponse = await axios.get(url);
				setIsLoading(false);
				setCards(cardsResponse.data);

			} catch (error) {
				alert('Error requesting data')
			}

		}

		fetchData();

	}, []);
	
	async function addToCart(card) {

		if(isLoginTrue) {
			try {
				const cart = {
					"title": card.title,
					"price": card.price,
					"imageURL": card.imageURL,
					"count": 1,
					"totalPrice": card.price,
					"parent_id": card.parent_id,
					"user_id": user.id
				}
	
				const findCart = cardCart.find((item) => Number(item.parent_id) === Number(card.parent_id));
				if (findCart) {
					setCardCart((prev) => prev.filter((itemCard) => Number(itemCard.parent_id) !== Number(card.parent_id)))
					await axios.delete(`${url}carted?user_id=${user.id}&parent_id=${findCart.parent_id}`);
				} else {
					
					const { data } = await axios.post(`${url}cart`, cart);
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
			await axios.delete(`${url}cart?user_id=${user.id}&parent_id=${id}`);
			setCardCart(prev => prev.filter(card => Number(card.parent_id) !== Number(id)));
		} catch (error) {
			alert('Failed to remove from cart');
		}
	}

	async function addToFavorites(card) {

		if(isLoginTrue) {
			try {
				const cardFav = {
					"title": card.title,
					"price": card.price,
					"imageURL": card.imageURL,
					"count": 1,
					"totalPrice": card.price,
					"parent_id": card.parent_id,
					"user_id": user.id
				}
	
				const findCart = favorites.find((item) => Number(item.parent_id) === Number(card.parent_id));
				if (findCart) {
					setFavorites((prev) => prev.filter((itemCard) => Number(itemCard.parent_id) !== Number(card.parent_id)))
					await axios.delete(`${url}favorite/${findCart.parent_id}`);
				} else {
					
					const { data } = await axios.post(`${url}favorite`, cardFav);
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
			if(card.user_id === user.id && card.parent_id === id) {
				idFav = card.parent_id;
			}
			return card
		})
		try {
			await axios.delete(`${url}favorite/${idFav}`);
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
		return cardCart.some(item => Number(item.parent_id) === Number(id))
	}

	function isFavorited(id) {
		return favorites.some(item => Number(item.parent_id) === Number(id))
	}

	return (

		<AppContext.Provider key={user.id} value={{
			cards, cardCart, favorites, isCardAdded, isFavorited, setOpenDrawer,
			setCardCart, addToCart
		}}>
			<div className="wrapper">
				<Drawer
					onClickCloseCart={() => setOpenDrawer(false)}
					cards={cardCart}
					onClickMinus={onClickMinus}
					opened={openDrawer}
					user={user}
					url={url} />

				<Header 
					onClickCart={() => setOpenDrawer(true)}
					userViewName={userViewName}
					isLoginTrue={isLoginTrue}
					setIsLoginTrue={setIsLoginTrue}
					setUser={setUser}
					setCardCart={setCardCart}
					user={user} />				

					<Routes>
						< Route path="/" element={<Home
							cards={cards}
							cardCart={cardCart}
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
							user={user}
							isLoginTrue={isLoginTrue}
							setTotalSumOfOrders={setTotalSumOfOrders}
							orders={orders}
							setOrders={setOrders}
							setTotalSumDescription={setTotalSumDescription}
							url={url} />} exact />

						<Route path="/shipping" element={ <Shipping
							setTotalSumOfOrders={setTotalSumOfOrders}
							totalSumOfOrders={totalSumOfOrders}
							user={user}
							isLoginTrue={isLoginTrue}
							setOrders={setOrders}
							totalSumDescription={totalSumDescription}
							setTotalSumDescription={setTotalSumDescription}
							url={url}  /> } exact />

						<Route path="/registration" element={ <Registration url={url}	 /> } exact />

						<Route path="/login" element={ <Login 
							setUserViewName={setUserViewName}
							isLoginTrue={isLoginTrue}
							setIsLoginTrue={setIsLoginTrue}
							setUser={setUser}
							setCardCart={setCardCart}
							setFavorites={setFavorites}
							url={url} /> } exact />

						<Route path="/admin" element={ <Admin url={url} user={user} /> } exact />
						<Route path="/edit" element={ <AdminEdit url={url} user={user} /> } exact />
						<Route path="/remove" element={ <AdminDelete url={url} user={user} /> } exact />
						<Route path="/user" element={ <UserEdit url={url} user={user} isLoginTrue={isLoginTrue} /> } exact />
						
					</Routes>				

			</div>

		</AppContext.Provider>
	);
}

export default App;