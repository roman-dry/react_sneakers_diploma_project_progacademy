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
		
		<div className="d-flex row">
			{favorites.map((card, index) => {
				
					return <Card 
					{...card}
					key={index}
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