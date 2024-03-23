'use client'

export default function AgeForm({setAgeGroup, ageGroup, dispatch}:any){
    const groups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    const getAgeGroup = (e:any) => {
        console.log(e.target.value)
        setAgeGroup(e.target.value)
    }
    const next = (e:any) => {
        if (ageGroup == -1){
            return;
        }
        console.log(ageGroup)
        localStorage.setItem("ageGroup", ageGroup);
        dispatch({type: "genderForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your age</div>
                    </div>
                    <div>
                        <select onChange={getAgeGroup} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-8">
                                <option value={-1} key={-1} selected>Choose an age group</option>
                                {groups.map((group, index) => {
                                    return(
                                        <>
                                        <option value={index} key={index}>{group}</option>
                                        </>
                                    )
                                })}
                        </select>
                    </div>
                    <div>
                    <button  onClick={next} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
