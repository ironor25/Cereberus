

const coinOffers = [
    {
        name: "Bitcoin",
        ticker: "BTC",
        price: "$67,500",
        volume: "1,200 BTC",
        exchange: "Cerberus",
    },
    {
        name: "Ethereum",
        ticker: "ETH",
        price: "$3,500",
        volume: "8,000 ETH",
        exchange: "Cerberus",
    },
    {
        name: "Solana",
        ticker: "SOL",
        price: "$150",
        volume: "50,000 SOL",
        exchange: "Cerberus",
    },
    {
        name: "Cardano (Coming Soon...)",
        ticker: "ADA",
        price: "$0.45",
        volume: "200,000 ADA",
        exchange: "Cerberus",
    },
];

export default function Coin() {
    return (
        <div className="min-h-screen bg-black text-white font-inter p-8">
            <h1 className="text-lime-500 text-4xl font-bold mb-8 tracking-wide">
                Coin Exchange Offers
            </h1>
            <div className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-800">
                            <th className="p-4 text-left font-bold text-white text-lg border-b-2 border-zinc-700 tracking-wide">
                                Name
                            </th>
                            <th className="p-4 text-left font-bold text-white text-lg border-b-2 border-zinc-700 tracking-wide">
                                Ticker
                            </th>
                            <th className="p-4 text-left font-bold text-white text-lg border-b-2 border-zinc-700 tracking-wide">
                                Price
                            </th>
                            <th className="p-4 text-left font-bold text-white text-lg border-b-2 border-zinc-700 tracking-wide">
                                Volume
                            </th>
                            <th className="p-4 text-left font-bold text-white text-lg border-b-2 border-zinc-700 tracking-wide">
                                Exchange
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {coinOffers.map((coin, idx) => (
                            <tr
                                key={coin.ticker}
                                className={idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"}
                            >
                                <td className="p-4">
                                    <span className="text-lime-500 font-semibold text-base">
                                        {coin.name}
                                    </span>
                                </td>
                                <td className="p-4 text-base">{coin.ticker}</td>
                                <td className="p-4 text-base">{coin.price}</td>
                                <td className="p-4 text-base">{coin.volume}</td>
                                <td className="p-4">
                                    <span className="bg-lime-500 text-black rounded-lg px-3 py-1 font-medium text-sm">
                                        {coin.exchange}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
