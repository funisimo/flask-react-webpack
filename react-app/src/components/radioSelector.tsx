import {Radio, RadioChangeEvent, Space} from 'antd';
import {extractCountriesAsOptions} from "../utils/dataParser";
import data from "../data/csvjson.json";

export interface option {
    name: string,
    value: number
}

const RadioSelector = ({...props}) => {
    const onChange = (e: RadioChangeEvent) => {
        props.handler(e.target.value);
    }

    const countryOptions: option[] = extractCountriesAsOptions(data)

    return (
        <Radio.Group onChange={(e: RadioChangeEvent) => onChange(e)} value={props.selectedCountry.value}>
            <Space direction="vertical">
                {
                    countryOptions.map((option: any) =>
                        <Radio key={option.value} value={option.value}>{option.name}</Radio>
                    )
                }
            </Space>
        </Radio.Group>
    )
}

export default RadioSelector