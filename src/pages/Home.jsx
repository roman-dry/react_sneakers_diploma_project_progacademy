import React, { useContext } from "react";

import Card from "../components/Card";
import { AppContext } from "../App";

function Home({ cards,
	searchValue,
	onChangeInputValue,
	onRemoveSearch,
	addToCart,
	onClickMinus,
	addToFavorites,
	removeFromFavorites,
	isLoading
   }) {

	const { isFavorited } = useContext(AppContext);

	function renderCards() {
		return (isLoading ? [...Array(12)].map(card => {
			return <Card 
				loading={isLoading}  />
		}) : cards.map((card, index) => {
			if(card.title.toLowerCase().includes(searchValue.toLowerCase())) {
				return <Card 
				{...card}
				key={index}
				index={index}
				onPlus={(card) => addToCart(card)}
				onFavorite={(card) => addToFavorites(card)}
				removeFromFavorites={removeFromFavorites}
				favorited={isFavorited(card.id)}
				loading={isLoading}  />
			}
			 else if(searchValue === "") {
				return <Card 
				{...card}
				index={index}
				onPlus={(card) => addToCart(card)}
				onClickMinus={(id) => onClickMinus(id)}
				onFavorite={(card) => addToFavorites(card)}
				removeFromFavorites={removeFromFavorites}
				favorited={isFavorited(card.id)}
				loading={isLoading} />
			}
			
		}))

	}

	return (<div className="content p-5">	
		<div className="inputLine justify-content-between">
			<h2 className="m-0 mb-3">{searchValue ? `Search by request: ${searchValue}` : 'ALL SNEAKERS'}</h2>
			<div className="search-block d-flex mt-2">
				<img className="pl-1" width="20px" src="img/search.svg" alt="Search"></img>
				<input className="inputBlock" onChange={onChangeInputValue} 
						placeholder="Search..."
						value={searchValue}>								
				</input>
				{searchValue && <button onClick={onRemoveSearch} className="removeBtn">
					<img className="rotate-plus" width="10px" src="img/plus_button.svg" alt="plus-button" />
				</button>}
			</div>
		</div>	
		<marquee className='mb-3'> 
			<h3 style={{color: 'blue'}}>PROMOTION! FREE FEE ON PURCHASES OVER $1000!</h3>
			</marquee>			
		<div className="d-flex row">
			{renderCards()}
			
		</div>
	</div>
	)
}

export default Home;