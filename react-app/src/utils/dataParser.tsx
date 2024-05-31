import { keysInInterest, keyInInterestName } from "./CONSTS";
import { option } from "../components/radioSelector";

interface dataStructure {
    "Entity": string,
    "Code": string,
    "Year": number,
    "Number of patents in electric vehicle machine technology": number | string,
    "Number of patents in electric vehicle storage": number | string,
    "Number of patents in electric vehicle management": number | string,
    "Number of patents in electric vehicle communication technology": number | string,
    "Number of patents in electric vehicle charging stations": number | string
}

interface resultInt {
    xValue: number[],
    yValues: any
}

export const extractCountriesAsOptions = (data: dataStructure[]) => {
    const countryObject:any = {}
    const result:option[] = []
    let amountOfCountries = 0
    for(let id in data){
        countryObject[data[id].Entity] = data[id].Entity
    }
    for(let id in countryObject){
        result.push({
            value: amountOfCountries,
            name: id
        })
        amountOfCountries++
    }
    return result
}

const resetYearsCheck = (tmpYearsCheck:any) => {
    for(let id in tmpYearsCheck){
        tmpYearsCheck[id] = true
    }
    return tmpYearsCheck
}
export const dataParser = (data: dataStructure[], entityType: string) => {
    const result: resultInt = {
        xValue: [],
        yValues: {
            "EV machine tech": [],
            "EV storage": [],
            "EV management": [],
            "EV communication tech": [],
            "EV charging stations": [],
        }
    }
    let years: any = {}
    let tmpYearsCheck: any = {}
    //casting object, to filter out unique values
    for(let id in data){
        years[data[id].Year] = data[id].Year
        tmpYearsCheck[data[id].Year] = false
    }
    //finding each year values
    const yearsArr = Object.keys(years)
    for(let yearId in years){
        result.xValue.push(years[yearId])
        tmpYearsCheck = resetYearsCheck(tmpYearsCheck)
        // parse data to extract data for each year entry
        for(let i in data){
            if(data[i].Entity === entityType){
                tmpYearsCheck[data[i].Year] = false
                if(data[i].Year === years[yearId]){
                    for(let key = 0; key < keysInInterest.length; key++){
                        // @ts-ignore
                        let item = data[i][keysInInterest[key]]
                        if(typeof item === 'number'){
                            result.yValues[keyInInterestName[key]].push(item)
                        }else{
                            result.yValues[keyInInterestName[key]].push(0)
                        }
                    }
                }
            }
        }
        // add missing entries if not found in data per year
        if(tmpYearsCheck[years[yearId]]){
            for(let key = 0; key < keysInInterest.length; key++){
                result.yValues[keyInInterestName[key]].push(0)
            }
        }

    }

    return result
}