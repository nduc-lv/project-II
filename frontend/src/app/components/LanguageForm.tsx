'use client'

import {useState, useEffect} from "react"

export default function LanguageForm({language, setLanguage, dispatch}:any){
    
    const languages = ["English", "Tiếng Việt"]
    const getLanguage = (e:any) => {
        setLanguage(e.target.value)
    }
    const next = (e:any) => {
        if (language == -1){
            return;
        }
        localStorage.setItem("language", language)
        dispatch({type: "interestForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your Language</div>
                    </div>
                    
                    <div className="flex justify-center items center">
                        <select onChange={getLanguage} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 my-12">
                                <option value={-1} key={-1} selected>Choose a language</option>
                                {languages.map((language, index) => {
                                    return(
                                        <>
                                        <option value={index} key={index}>{language}</option>
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
