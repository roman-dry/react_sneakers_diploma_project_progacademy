import React, { useContext, useState } from 'react';
import ContentLoader from "react-content-loader";
import { AppContext } from '../../App';

import'./card.scss';

function Card( {index, id, parent_id, title, price, imageURL, count, totalPrice, onPlus, onFavorite, removeFromFavorites,
	favorited = false, loading = false} ) {

	const [buttonColorChecked, setButtonColorChecked] = useState(false);
	const [buttonChecked, setButtonChecked] = useState(false);
	const [buttonColorHeart, setButtonColorHeart] = useState(favorited);
	const [buttonHeartLiked, setButtonHeartLiked] = useState(favorited);	

	const { isCardAdded } = useContext(AppContext);
	const card = {id, parent_id, title, price, imageURL, count, totalPrice}

	function onClickPlus() {		
		setButtonColorChecked(!buttonColorChecked);
		setButtonChecked(!buttonChecked);
		onPlus(card)		
	}
	

	function onClickFavorite() {		
		setButtonColorHeart(!buttonColorHeart);
		setButtonHeartLiked(!buttonHeartLiked);
		!buttonColorHeart ? onFavorite(card)	: 	removeFromFavorites(parent_id)
	}
	
	return (<div className="card mr-2 mt-2 position-relative col-xs-13 col-sm-5 col-md-4 col-lg-3 col-xl-2">
			
			{
				loading ? (<ContentLoader 
					speed={2}
					width={280}
					height={220}
					viewBox="0 0 280 220"
					backgroundColor="#f3f3f3"
					foregroundColor="#ecebeb"
				>
					   <rect x="-4" y="146" rx="5" ry="5" width="189" height="15" /> 
						<rect x="-4" y="172" rx="5" ry="5" width="100" height="15" /> 
						<rect x="0" y="227" rx="5" ry="5" width="60" height="15" /> 
						<rect x="187" y="163" rx="5" ry="5" width="32" height="27" /> 
						<rect x="184" y="3" rx="5" ry="5" width="32" height="32" /> 
						<rect x="-4" y="-3" rx="10" ry="10" width="182" height="135" />
				</ContentLoader>) : (<div key={index}>{onFavorite && <button className={buttonColorHeart ? "button-heart-liked" : "button-heart-unliked"} 
				onClick={onClickFavorite}>
					<img width="15px" 
						src={buttonHeartLiked ? "img/heart-liked.svg" : "img/heart-unliked.svg"} 
						alt="Heart-liked" />
			</button>}
			<img width="100%" src={imageURL} alt="Sneakers 1" />
			<div className="stick position-absolute">
				<h5>{title}</h5>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<span>Price: </span>
						<b>${price}</b>
					</div>
					{onPlus && <button className={isCardAdded(parent_id) ? "button-checked" : ""} onClick={() => onClickPlus()}>
						<img className="mb-1" width="13px" 
							src={isCardAdded(parent_id) ? "img/checked.svg" : "img/plus_button.svg"} 
							alt="checked-button" />
					</button>}
				</div>
				
			</div> </div>)
			}			
			
		</div>);		

}

export default Card;