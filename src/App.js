
import Header from "./components/Header";
import Drawer from "./components/Drawer/index.js";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Shipping from "./pages/Shipping";
import Orders from "./pages/Orders/Orders";
import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

export const AppContext = createContext({});

function App() {
	// const cards = [
	// 	{
	// 		title: "Men's sneakers New Balance",
	// 		price: 249,
	// 		imageURL: "img/sneakers/1.png"
	// 	},
	// 	{
	// 		title: "Men's sneakers Converse",
	// 		price: 239,
	// 		imageURL: "img/sneakers/2.png"
	// 	},
	// 	{
	// 		title: "Men's sneakers Hoglsphere",
	// 		price: 259,
	// 		imageURL: "img/sneakers/3.png"
	// 	},
	// 	{
	// 		title: "Men's sneakers Kobe",
	// 		price: 229,
	// 		imageURL: "img/sneakers/4.png"
	// 	},

	// ];

	const [cards, setCards] = useState([]);
	const [cardCart, setCardCart] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		/*fetch("https://64440fc9466f7c2b4b60d1da.mockapi.io/items/all")
			.then(res => res.json())
			.then(data => {
				setCards(data)
			});*/


		async function fetchData() {

			try {
				setIsLoading(true);

				//const cartResponse = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart');

				//const favoriteResponse = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/favorites');			


				const cardsResponse = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/all');

				setIsLoading(false);

				//setCardCart(cartResponse.data);
				//setFavorites(favoriteResponse.data);
				setCards(cardsResponse.data);

			} catch (error) {
				alert('Error requesting data')
			}




			// axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/all').then((res) => {
			// 	setCards(res.data);
			// });

			// axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart').then((res) => {
			// 	setCardCart(res.data);
			// });

			// axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/favorites').then((res) => {
			// 	setFavorites(res.data);
			// });
		}

		fetchData();

	}, []);

	async function addToCart(card) {

		try {
			const findCart = cardCart.find((item) => Number(item.parentId) === Number(card.id));
			if (findCart) {
				setCardCart((prev) => prev.filter((itemCard) => Number(itemCard.parentId) !== Number(card.id)))
				await axios.delete(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart/${findCart.id}`);
			} else {
				setCardCart(prev => [...prev, card]);
				const { data } = await axios.post('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart', card);
				setCardCart((prev) => prev.map(card => {
					if (card.parentId === data.parentId) {
						return {
							...card,
							id: data.id
						}
					}
					return card;
				}));
			}

		} catch (error) {
			alert('Error add to cart');

		}


		/*[...cards].filter((card) => {
			if(id === card.id && !cardCart.includes(card)) {
				axios.post('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart', card);
				setCardCart((prev) => [...prev, card])
				
			}
			return cardCart;	
		} )*/


	}

	function onClickMinus(id) {

		try {
			axios.delete(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/cart/${id}`);
			//const newCart = [...cardCart].filter((card) => card.id !== id);
			//setCardCart(newCart);
			setCardCart(prev => prev.filter(card => Number(card.id) !== Number(id)));

		} catch (error) {
			alert('Failed to remove from cart');

		}
	}

	async function addToFavorites(card) {
		try {
			if (favorites.find(cardFav => cardFav.id === card.id)) {
				axios.delete('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/favorites', card.id);
				setFavorites((prev) => prev.filter((item) => item.id !== card.id))
			} else {
				const { data } = await axios.post('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/favorites', card);
				setFavorites(prev => [...prev, data])

			}

		} catch (error) {
			alert('Failed to add to Favorites!')

		}

	}

	function removeFromFavorites(id) {
		try {
			axios.delete(`https://64440fc9466f7c2b4b60d1da.mockapi.io/items/favorites/${id}`);
			setFavorites(prev => prev.filter(card => card.id !== id))
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
		return cardCart.some(item => Number(item.parentId) === Number(id))
	}

	function isFavorited(id) {
		return favorites.some(item => Number(item.id) === Number(id))
	}


	return (

		<AppContext.Provider value={{
			cards, cardCart, favorites, isCardAdded, isFavorited, setOpenDrawer,
			setCardCart, addToCart
		}}>
			<div className="wrapper">
				<Drawer
					onClickCloseCart={() => setOpenDrawer(false)}
					cards={cardCart}
					onClickMinus={onClickMinus}
					opened={openDrawer} />

				<Header onClickCart={() => setOpenDrawer(true)} />

				<Routes>
					< Route path="/" element={<Home
						cards={cards}
						cardCart={cardCart}
						searchValue={searchValue}
						onChangeInputValue={onChangeInputValue}
						onRemoveSearch={onRemoveSearch}
						addToCart={addToCart}
						addToFavorites={addToFavorites}
						removeFromFavorites={removeFromFavorites}
						isLoading={isLoading}
					/>}
						exact />

					<Route path="/favorites" element={<Favorites
						addToFavorites={addToFavorites}
						removeFromFavorites={removeFromFavorites} />} exact />

					<Route path="/orders" element={<Orders />} exact />

					<Route path="/shipping" element={ <Shipping /> } exact />
				</Routes>

			</div>

		</AppContext.Provider>


	);
}

export default App;

{/* <div className="content p-5">	
			<div className="d-flex justify-content-between">
				<h1 className="m-0 mb-5">{searchValue ? `Search by request: ${searchValue}` : 'All Sneakers'}</h1>
				<div className="search-block d-flex mt-2">
					<img className="pl-1" width="20px" src="img/search.svg" alt="Search"></img>
					<input onChange={onChangeInputValue} 
							placeholder="Search..."
							value={searchValue}>								
					</input>
					{searchValue && <button onClick={onRemoveSearch} className="removeBtn">
						<img className="rotate-plus" width="10px" src="img/plus_button.svg" alt="plus-button" />
					</button>}
				</div>

			</div>				
			<div className="d-flex row">
				{cards.map(card => {
					if(card.title.toLowerCase().includes(searchValue.toLowerCase())) {
						return <Card 
						card={card}
						key={card.id}
						onPlus={(card) => addToCart(card)}
						onFavorite={(card) => addToFavorites(card)}
						removeFromFavorites={removeFromFavorites}  />
					} else if(searchValue === "") {
						return <Card 
						card={card}
						key={card.id}
						onPlus={(card) => addToCart(card)} 
						onFavorite={(card) => addToFavorites(card)}
						removeFromFavorites={removeFromFavorites} />
					}

					
				})}
				
				
				<div className="card mr-3 position-relative col-xs-12 col-sm-10 col-md-4 col-lg-3 col-xl-2">
					<button className="button-heart-unliked position-absolute">
						<img width="15px" src="img/heart-unliked.svg" alt="Heart-unliked" />
					</button>
					<img className="mb-5" width="100%" src="img/sneakers/2.png" alt="Sneakers 1" />
					<div className="stick position-absolute">
						<h5>Men's sneakers Converse</h5>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<span>Price: </span>
								<b>$249</b>
							</div>
							<button>
								<img className="mb-1" width="10px" src="img/plus_button.svg" alt="plus-button" />
							</button>
						</div>

					</div>
					
				</div>
				<div className="card mr-3 position-relative col-xs-12 col-sm-10 col-md-4 col-lg-3 col-xl-2">
					<button className="button-heart-unliked position-absolute">
						<img width="15px" src="img/heart-unliked.svg" alt="Heart-unliked" />
					</button>
					<img className="mb-5" width="100%" src="img/sneakers/3.png" alt="Sneakers 1" />
					<div className="stick position-absolute">
						<h5>Men's sneakers Hoglsphere</h5>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<span>Price: </span>
								<b>$249</b>
							</div>
							<button>
								<img className="mb-1" width="10px" src="img/plus_button.svg" alt="plus-button" />
							</button>
						</div>

					</div>
					
				</div>
				<div className="card position-relative col-xs-12 col-sm-10 col-md-4 col-lg-3 col-xl-2">
					<button className="button-heart-unliked position-absolute">
						<img width="15px" src="img/heart-unliked.svg" alt="Heart-unliked" />
					</button>
					<img className="mb-5" width="100%" src="img/sneakers/4.png" alt="Sneakers 1" />
					<div className="stick position-absolute">
						<h5>Men's sneakers Kobe</h5>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<span>Price: </span>
								<b>$249</b>
							</div>
							<button>
								<img className="mb-1" width="10px" src="img/plus_button.svg" alt="plus-button" />
							</button>
						</div>

					</div>
					
				</div>
			</div>			
		</div> */}

