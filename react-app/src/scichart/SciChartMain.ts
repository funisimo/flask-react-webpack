import {
    ELegendOrientation,
    ELegendPlacement,
    ENumericFormat,
    LegendModifier,
    NumericAxis,
    SciChartSurface,
    StackedColumnCollection,
    StackedColumnRenderableSeries,
    WaveAnimation,
    XyDataSeries,
} from "scichart";
import { appTheme } from "./theme";
import {colorMatchForKeyInInterest} from "../utils/CONSTS";
export const divElementId = "chart";

export const sciChartMain = async (selectedCountry: string, data: any) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create XAxis, YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            axisTitle: "Year",
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelPrecision: 0,
            axisTitle: "Amount of cars",
        })
    );

    const xValues = data.xValue

    const series = []
    const createNewSeries = (xValues: any, yValues: any, SeriesName: string, int: number) => {
        // @ts-ignore
        const fillColor = appTheme[colorMatchForKeyInInterest[int]]
        return new StackedColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues, dataSeriesName: SeriesName }),
            fill: fillColor,
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 2,
            opacity: 0.8,
            stackedGroupId: "StackedGroupId",
        });
    }
    let int = 0;
    for(let id in data.yValues){
        series.push(createNewSeries(xValues, data.yValues[id], id, int))
        int++
    }

    // To add the series to the chart, put them in a StackedColumnCollection
    const stackedColumnCollection = new StackedColumnCollection(wasmContext);
    stackedColumnCollection.dataPointWidth = 0.6;
    stackedColumnCollection.add(...series);
    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    // Add the Stacked Column collection to the chart
    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    // Add some interactivity modifiers
    // sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true,
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedColumnCollection };
};
