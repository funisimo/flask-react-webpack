import React from 'react';
import './App.css';
import PieChart from './scichart/StackedColumnsChart'
import {List, Typography} from "antd";
const stepsOnDevelopment = [
    "1. Prepare the environment to be able to consume the library",
    "2. Introduced myself to examples and documentation",
    "3. Took 1 example as the base for test: https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/drawExample.ts",
    "4. Integrated into React and provided proper Python Resource loading",
    "5. Added data parsing utils functionality",
    "6. Added some basic unit tests to be able to handle the data parsing easier (as i found that webgl is not supported and adding support would exceed my 'under day' limit)",
    "7. Adjusted and displayed the parsed data",
    "8. Added filtering mechanism to filter by country",
    "9. Added styling",
];
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <PieChart/>
                <p>
                    Welcome to my playground, above you can see Scichart in action.
                </p>
                <p>
                    <List
                          header={<div>Steps on creation that i did for the test:</div>}
                          bordered
                          dataSource={stepsOnDevelopment}
                          renderItem={(item) => (
                            <List.Item>
                              {item}
                            </List.Item>
                          )}
                        />
                </p>
                <p>
                    During the test i found myself into not beeing able find proper react examples, would like to spend more time in understanding <br/>
                    on how to load Scichart without using Ref, and proper data management like Immutable that takes benefits of ShadowDom similar to How React does it
                </p>
            </header>
        </div>
    );
}

export default App;
