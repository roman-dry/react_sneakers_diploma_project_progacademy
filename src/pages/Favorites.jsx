import React, { useContext } from "react";
import { AppContext } from "../App";
import Card from "../components/Card";

function Favorites({
	addToCart,
	addToFavorites,
	removeFromFavorites }) {

	const { favorites } = useContext(AppContext);
		
	return (<div className="content p-5">	
		FAVORITES
		{/* <div className="d-flex justify-content-between">
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

		</div>				 */}
		<div className="d-flex row">
			{favorites.map(card => {
				
					return <Card 
					card={card}
					key={card.id}
					onPlus={(card) => addToCart(card)}
					favorited={true}
					onFavorite={addToFavorites}
					removeFromFavorites={removeFromFavorites}  />
				

				
			})}
		</div>
	</div>
	)

}

export default Favorites;