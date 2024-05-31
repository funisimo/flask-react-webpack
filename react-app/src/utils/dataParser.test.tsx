import {dataParser,extractCountriesAsOptions} from './dataParser';
import data from "../data/csvjson.json";

it('should extract 82 countris', () => {
  const result = extractCountriesAsOptions(data)
    expect(result.length).toEqual(82)
});

it('should return only World data with exact same length of data for both x and y', () => {
    const result = dataParser(data, "World")
    expect(result.xValue.length).toEqual(22)
    expect(result.yValues["EV charging stations"].length).toEqual(22)
});