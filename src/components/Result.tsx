import { LEVEL_LIST } from '../constant/JJC';
import { JJC_SHOP_TAB_LIST, JJC_SHOP_ITEM } from '../constant/Shop';
import '../styles/Result.css'
import dayjs from 'dayjs'
import { useState } from 'react';
const endDay = dayjs('2023-08-13')
const countToLevel15Idx = 13;

// 策略生成
function getStrategy(impossible, weekCount?, weekReward?) {
    if (impossible) return '无法在赛季结束前兑换完勾选部件'
    let result = `周${1}打${weekCount[0]}次，到达${weekReward[0].name}段位。\n`;

    for (let day = 1; day < 7; day++) {
        if (weekReward[day - 1] === weekReward[6]) break
        result += `周${day + 1}打${weekCount[day]}次，到达${weekReward[day].name}段位。\n`
    }
    result += `剩余天数保持${weekReward[6].name}段位，在周日结算后保留10次。`
    return result;
}

// 通过对决次数计算最小期望级别
function getLevelByCount(count: number): LevelItem {
    if (count < 15) return LEVEL_LIST[countToLevel15Idx];
    let left = 0, right = countToLevel15Idx;
    while (left < right) {
        let mid = left + Math.floor((right - left) * 0.5)
        if (LEVEL_LIST[mid].count as number <= count) {
            right = mid
        } else {
            left = mid + 1;
        }
    }
    return LEVEL_LIST[left];
}

// 计算达到需求的最小起点
function getMinLevelInMonday(startLevelIdx, endLevelIdx, needCoin, weekCount): LevelItem {
    let left = endLevelIdx, right = startLevelIdx;
    while (left < right) {
        let mid = left + Math.floor((right - left) * 0.5)
        let { total: result } = toGetResultFromStartCountAndMaxLevel(LEVEL_LIST[endLevelIdx], weekCount, LEVEL_LIST[mid].count);
        console.log(`needCoin:${needCoin} result:${result} mid:${mid}`);
        if (result <= needCoin) {
            right = mid
        } else {
            left = mid + 1;
        }
    }
    console.log(`return ${left}`);
    return LEVEL_LIST[left - 1];
}



type ResultProps = {
    state: any
    dispatch: (action) => void
}


// 计算兑换需要的货币量
const toCalculateTotal = (state) => {
    let sum = 0;
    JJC_SHOP_TAB_LIST.forEach(tabKey => {
        const selectedList = state[tabKey];
        JJC_SHOP_ITEM[tabKey].forEach(item => {
            if (selectedList.includes(item.name)) {
                sum += item.count
            }
        })
    })
    return sum;
}


// 计算剩余时间星期1~7的数量
const getTheDays: () => { weekCount: number[], diffDay: number } = () => {
    const today = dayjs();
    const diffDay = endDay.diff(today, 'day') + 2;
    const week = Math.floor(diffDay / 7);
    let left = diffDay % 7;
    const day = dayjs().day() - 1;
    let weekCount: number[] = [];

    for (let index = 0; index < 7; index++) {
        if (index >= day && left) {
            weekCount[index] = week + 1;
            left--;
        } else {
            weekCount[index] = week
        }

    }
    return { weekCount, diffDay };

}

// 策略2：周一打N次,周二5次，周三~周日打3次
const toGetResultFromStartCountAndMaxLevel = (maxLevel: LevelItem, weekCount: number[], startCount = 15) => {

    // 一周七天每天打的次数 startCount,5,3~
    let nextDayCount = startCount + 5;

    // 每天打的次数
    let weekDayCount = new Array(7).fill(3);
    weekDayCount[0] = startCount;
    weekDayCount[1] = 5;

    // 每天到达的级别
    let weekDayLevel = [getLevelByCount(startCount), getLevelByCount(nextDayCount)];
    for (let i = 2; i < 7; i++) {
        nextDayCount += 3;
        weekDayLevel[i] = getLevelByCount(nextDayCount);
    }
    // FIX LEVEL 针对 level 中超过 maxLevel 的情况做处理
    weekDayLevel = weekDayLevel.map(item => item.id > maxLevel.id ? maxLevel : item)


    // 次数 周一12次 周二5次 剩余3次；
    let countRewardDayMap = {
        0: 12,
        1: 5,
    }
    let total = 0;
    // 日结算
    weekCount.forEach((dayCount, idx) => {
        let count = countRewardDayMap[idx] || 3;
        // 每天前12次对决的5代币
        total += count * 5 * dayCount;
        total += dayCount * weekDayLevel[idx].day
    });

    //累加周日的周结算
    total += weekCount[6] * maxLevel.week

    console.log('total', total, 'weekDayLevel', weekDayLevel)
    const textResult = getStrategy(false, weekDayCount, weekDayLevel);
    return { total, textResult };
    // 两个极限策略
    // 1.完全不买次数
    // 2.周一买到目标段位，接下来每周至少3次，额外两次随便。（目标段位>= 时尚契合者2）
}

export default function Result({ state }: ResultProps) {
    const [resultRecord, setResultRecord] = useState({
        impossible: false,
        needCoin: 0,
        needBuyCount: 0,
        needBuyCountMonday: 0,
        needBuyCountDiamond: 0,
        getDiamond: 0,
        getCoin: 0,
        diffDay: 0,
        result: '',
    })


    const toCalculate = () => {
        const needCoin = toCalculateTotal(state) - state.currentSave

        const targetLevel = LEVEL_LIST.find(item => item.id === state.level)
        if (!targetLevel) return null;

        const targetLevelIdx = LEVEL_LIST.indexOf(targetLevel);
        const targetAndCountToLevel15DiffLevel = countToLevel15Idx - targetLevelIdx;


        const { weekCount: dayCount, diffDay } = getTheDays();
        let needBuyCount = 0;
        let needBuyCountMonday = 0;

        // 第一天打15次
        const { total: minGet, textResult: minTextResult } = toGetResultFromStartCountAndMaxLevel(targetLevel, dayCount);
        // 第一天打目标段位次数
        const { total: maxGet, textResult: maxTextResult } = toGetResultFromStartCountAndMaxLevel(targetLevel, dayCount, targetLevel.count);
        let impossible = false;

        let getCoin = 0;
        let result = '';
        if (maxGet < needCoin) {
            // 达不到目标
            impossible = true
            getCoin = maxGet;
            result = getStrategy(impossible)
        } else if (minGet > needCoin) {
            // 第一天不买次数
            impossible = false;
            getCoin = minGet
            result = minTextResult
        } else {
            // 第一天需要买，看看买几天
            let suitableLevel = getMinLevelInMonday(countToLevel15Idx, targetLevelIdx, needCoin, dayCount);
            const { total: suitableGet, textResult } = toGetResultFromStartCountAndMaxLevel(targetLevel, dayCount, suitableLevel.count)
            needBuyCountMonday = suitableLevel.count as number - 15;
            needBuyCount = dayCount[0] * needBuyCountMonday;
            getCoin = suitableGet;
            result = textResult
        }

        setResultRecord({
            impossible,
            needCoin,
            needBuyCount,
            needBuyCountMonday,
            needBuyCountDiamond: needBuyCount * 10,
            getDiamond: diffDay * 5 * 3,
            getCoin,
            diffDay,
            result,

        })
    }

    console.log('resultRecord', resultRecord)

    return <div className="result-wrap">
        <button className="result-action" onClick={toCalculate}>开始计算</button>

        <div className="result-item">
            <div className="result-item-title">计算结果：</div>

            <p><span className="result-item-label">获得代币数量:</span>{resultRecord.getCoin}</p>
            <p><span className="result-item-label">所需代币数量:</span>{resultRecord.needCoin}</p>
            <p><span className="result-item-label">周一买次数:</span>{resultRecord.needBuyCountMonday}</p>
            {/* <p><span className="result-item-label">消耗钻石总量:</span>{resultRecord.needBuyCountDiamond}</p> */}
            {/* <p><span className="result-item-label">获得钻石总量:</span>{resultRecord.getDiamond}</p> */}
            {/* <p><span className="result-item-label">赛季剩余天数:</span>{resultRecord.diffDay}</p> */}
            <p><span className="result-item-label">策略概括:</span>
                <br />
                <span>{resultRecord.result}</span>
            </p>

        </div>
    </div>
}
