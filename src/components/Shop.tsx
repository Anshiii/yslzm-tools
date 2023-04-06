import { useEffect, useReducer, useState } from "react"
import { JJC_SHOP_ITEM, JJC_SHOP_TAB, JJC_SHOP_TAB_LIST } from "../constant/Shop";
import '../styles/Shop.css'
import { simpleUpdateState } from "../util";




type ShopProps = {
    state: any
    dispatch: (action) => void
}

export default function List({ state, dispatch }: ShopProps) {
    const [currentTab, setCurrentTab] = useState<string>(JJC_SHOP_TAB[0].id);

    console.log(state);



    const checkboxChange = (e: React.FormEvent<HTMLInputElement>) => {
        let checked = e.currentTarget.checked;
        let name = e.currentTarget.name;
        console.log(checked, name);
        const oldSelected = state[currentTab];
        let newSelected: string[] = checked ? [...oldSelected, name] : oldSelected.filter(item => item !== name);


        dispatch({
            type: 'update',
            payload: {
                [currentTab]: newSelected
            }
        })
    }

    const selectAll = (e: React.FormEvent<HTMLInputElement>) => {
        let checked = e.currentTarget.checked;
        let newSelect = checked ? JJC_SHOP_ITEM[currentTab].map(item => item.name) : [];
        dispatch({
            type: 'update',
            payload: {
                [currentTab]: newSelect
            }
        })

    }


    return <section className="shop">
        <div className="shop-tab-wrap">
            {JJC_SHOP_TAB.map(item =>
                <div className="shop-tab-item"
                    onClick={() => setCurrentTab(item.id)}
                    key={item.id}
                    data-shop-current={currentTab === item.id}
                >{item.name}({state[item.id].length})</div>)}
        </div>
        <ul className="shop-content-wrap">
            <li className="shop-content-header">
                <span>位置</span>
                <span>名称</span>
                <span>代币数</span>
                <span><input type="checkbox" name="selectAll" id="selectAll" checked={state[currentTab].length === JJC_SHOP_ITEM[currentTab].length} onChange={selectAll} /></span>
            </li>
            {JJC_SHOP_ITEM[currentTab].map((item, idx) => <li key={item.name} className="shop-content-body">
                <div >
                    <span>{item.position}</span>
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                    <span> <input type="checkbox" name={item.name} id={item.name} checked={state[currentTab].includes(item.name)} onChange={checkboxChange} /></span>
                </div>
            </li>)}
        </ul>

    </section>
}
