import { useEffect, useRef, useReducer } from "react"
import { JJC_Strategies, LEVEL_LIST } from "../constant/JJC";
import '../styles/Statistics.css'
import Select from '../components/Select'


type StatisticsProps = {
    state: any
    dispatch: (action) => void
}

export default function Statistics({state,dispatch }: StatisticsProps) {

    const currentSaveChange = (e) => {
        dispatch({
            type: 'update',
            payload: {
                currentSave: e.currentTarget.value
            }
        })
    }

    const selectedChange = (type, selected) => {
        dispatch({
            type: 'update',
            payload: {
                [type]: selected
            }
        })
    }


    return <ul>

        <li className="statistics-item">
            <span className="statistics-item-label">当前代币数量：</span>
            <div className="statistics-item-interact">
                <input
                    placeholder="请输入代币数"
                    type="number"
                    id="currentSave"
                    value={state.currentSave}
                    onChange={currentSaveChange} />
            </div>
        </li>
        <li className="statistics-item">
            <span className="statistics-item-label">周日结算段位：</span>
            <div className="statistics-item-interact">
                <Select
                    id="level"
                    placeholder="请选择段位"
                    onChange={(selected) => selectedChange('level', selected)}
                    sourceData={LEVEL_LIST.map(level => ({ value: level.id, label: level.name }))}
                />
            </div>
        </li>
        {/* <li className="statistics-item">
            <span className="statistics-item-label"
                style={
                    { verticalAlign: 'top' }
                }
            > 竞技场策略：</span>
            <div className="statistics-item-interact">
                <Select
                    id="strategy"
                    placeholder="请选择策略"
                    onChange={(selected) => selectedChange('strategy', selected)}
                    sourceData={JJC_Strategies.map(strategy => ({ value: strategy.id, label: strategy.name }))}
                />
                <div>策略概述&gt;&gt;&gt;周一15次机会到~</div>
            </div>
        </li> */}
    </ul>
}
