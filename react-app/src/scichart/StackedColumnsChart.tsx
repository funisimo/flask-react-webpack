import * as React from "react";
import {SciChartSurface, StackedColumnCollection} from "scichart";
import {sciChartMain, divElementId} from "./SciChartMain";
import RadioSelector, {option} from "../components/radioSelector";
import {useState} from "react";
import {dataParser, extractCountriesAsOptions} from "../utils/dataParser";
import data from "../data/csvjson.json";
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles({
    appContainer: {
        display: "flex",
        flexDirection: "row",
        maxHeight: "500px"
    },
    graphContainer: {
        width: '80%'
    },
    FilterContainer: {
        width: '20%',
        overflow: "auto",
        paddingLeft: '10px'
    }
});

export default function StackedColumnChart() {
    const classes = useStyles();
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const stackedColumnCollectionRef = React.useRef<StackedColumnCollection>();
    const [selectedCountry, setSelectedCountry] = useState({
        value: 81,
        name: "World"
    })

    const countryOptions: option[] = extractCountriesAsOptions(data)
    const parsedData = dataParser(data, selectedCountry.name)

    React.useEffect(() => {
        const chartInitializationPromise = sciChartMain(selectedCountry.name, parsedData).then((res) => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            stackedColumnCollectionRef.current = res.stackedColumnCollection;
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                // @ts-ignore
                sciChartSurfaceRef.current.delete();
            });
        };
    }, [selectedCountry]);

    const onCountrySelection = (value: number) => {
        const item: any = countryOptions.find((option) => {
            return option.value === value
        })
        setSelectedCountry(item)
    }


    return (
        <div>
            <div className={classes.appContainer}>
                <div className={classes.graphContainer} id={divElementId}/>
                <div className={classes.FilterContainer}>
                    <RadioSelector handler={onCountrySelection} selectedCountry={selectedCountry}/>
                </div>
            </div>
        </div>
    );
}
