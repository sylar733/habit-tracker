function Heroection() {
  return (
    <div    className="flex flex-col mx-16 items-center mt-[100px] gap-6">
            <span className="font-bold text-3xl text-center">
                Build the habits that <span className="text-red-600">Matter!</span>
            </span>
            <p className="text-center text-sm sm:w-[430px] w-[370px]">
        Feeling overwhelmed? Our easy-to-use habits tracker helps you create and track your
         habits, so you can focus on what really matters.
            </p>
            <button className={`block text-sm  page-font-mono font-bold px-9 py-3 rounded-lg text-white transition bg-red-600 focus:outline-none
            tpye="button"
                 `}>
                {`Let's Get Started!`}
            </button>
    </div>
  )
}

export default Heroection