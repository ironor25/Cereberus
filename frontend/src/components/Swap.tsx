
function Swap(){
    return (
      <div
        className="w-screen h-screen text-white"
        style={{
          backgroundImage: "url('/circles.svg')",
          backgroundSize: "cover",
          position: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-center items-center mt-36">
          <div className="w-xl">
            <span>Cooking</span>
          </div>
          <div className="flex w-xl justify-between">
            <button
            className="bg-transparent p-3 rounded-2xl mr-2 w-40 cursor-pointer hover:bg-lime-300/20 active:bg-lime-300 transition-colors"
          >
            Instant
          </button>
          <button
            className="bg-transparent p-3 rounded-2xl mr-2 w-40 cursor-pointer hover:bg-lime-300/20 active:bg-lime-300 transition-colors"
          >
            Trigger
          </button>
          <button
            className="bg-transparent p-3 rounded-2xl mr-2 w-40 cursor-pointer hover:bg-lime-300/20 active:bg-lime-300 transition-colors"
          >
            Recurring
          </button>
          </div>

          <div className="h-30 bg-slate-900 w-xl rounded-2xl p-3 m-3">
            <div className="p-1">
            <span className="font-medium">Selling</span>
            </div>
            <div className="pt-5 flex justify-between">
            <button className="bg-gray-700 w-20 h-10 rounded-xl"> SOL <select></select></button>
            <input className="border-2 border-gray-400" type="number"></input>
            </div>
          </div>

          <div className="h-30 bg-slate-900 w-xl rounded-2xl p-3 m-2">
            <div className="p-1">
            <span className="font-medium">Buying</span>
            </div>
            <div className="pt-5 flex justify-between">
            <button className="bg-gray-700 w-20 h-10 rounded-xl"> SOL <select></select></button>
            <input className="border-2 border-gray-400" type="number"></input>
            </div>
          </div>
          <div className="m-2 h-15  w-xl flex">
          <button className="bg-lime-200 text-gray-800 w-xl rounded-2xl cursor-pointer">Connect</button>
          </div>
        </div>
      </div>
    )
}

export default Swap;