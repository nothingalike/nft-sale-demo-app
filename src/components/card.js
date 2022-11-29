import { getSpaceUntilMaxLength } from "@testing-library/user-event/dist/utils";

function Card(props) {

    const buyNft = (event) => {
        props.buy(props.rarity);
        event.preventDefault();
    }

    return (
        <div className="bg-gray-400 max-w-sm rounded overflow-hidden shadow-lg mr-3">
            <img className="w-full" src={`https://ipfs.io/ipfs/${props.imageUrl}`} />
            <div className="px-6 py-2">
                <div className="font-bold text-xl">{props.name}</div>
                <div className="text-xl">{props.rarity}</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <p className="inline-flex px-4 font-bold">{parseInt(props.cost)/1000000} ADA</p>
                <button onClick={buyNft} type="button" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Buy</button>
            </div>
        </div>
    )
}

export default Card;