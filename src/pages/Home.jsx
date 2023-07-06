import React, { useContext } from "react";
import Card from "../components/Card";
import { AppContext } from "../App";

function Home({ cards,
	searchValue,
	onChangeInputValue,
	onRemoveSearch,
	addToCart,
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
				onFavorite={(card) => addToFavorites(card)}
				removeFromFavorites={removeFromFavorites}
				favorited={isFavorited(card.id)}
				loading={isLoading} />
			}

			
		}))

	}

	return (<div className="content p-5">	
		<div className="inputLine justify-content-between">
			<h1 className="m-0 mb-5">{searchValue ? `Search by request: ${searchValue}` : 'All Sneakers'}</h1>
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
		<div className="d-flex row">
			{renderCards()}
			
		</div>
	</div>
	)
}

export default Home;