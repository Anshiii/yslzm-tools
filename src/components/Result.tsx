import { LEVEL_LIST } from '../constant/JJC';
import { JJC_SHOP_TAB_LIST, JJC_SHOP_ITEM } from '../constant/Shop';
import '../styles/Result.css'
import dayjs from 'dayjs'
import { useState } from 'react';
const endDay = dayjs('2023-08-13')
//  从时尚契合者2升到下一个 level 需要的次数 
const countToLevel15ToNextLevelList = [1, 3, 4, 5, 7, 12, 13, 17, 33, 38, 39, 40, 41];
const countToLevel15Idx = 13;
const countToLevel15 = LEVEL_LIST[13]; // 15次打到时尚契合者2 下标13 日结算160 
const countToLevel20 = LEVEL_LIST[9]; // 20次打到流行缔造3 下标9 日结算250
const countToLevel23 = LEVEL_LIST[8]; // 23次打到首席创意1 
const countToLevel25 = LEVEL_LIST[8]; //25次打到首席创意1 下标8 日结算275
const countToLevel26 = LEVEL_LIST[7]; //26次打到首席创意2 
const countToLevel29 = LEVEL_LIST[6]; //29次打到首席创意3 
const countToLevel30 = LEVEL_LIST[6]; //30次打到首席创意3 
const countToLevel32 = LEVEL_LIST[5]; //32次打到引领潮流之巅1
const countToLevel35 = LEVEL_LIST[5]; //35次打到引领潮流之巅1 下标5 日结算400
const countToLevel40 = LEVEL_LIST[4]; //40次打到引领潮流之巅2 下标4 日结算450
const countToLevel45 = LEVEL_LIST[3]; //45次打到引领潮流之巅3 下标3 日结算500

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
    console.log(`---needed----${sum}`);

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
    console.log('weekCount', weekCount);
    return { weekCount, diffDay };

}


// 周一买到目标段位
const strategyMondayToTarget = (targetLevel, weekCount) => {

    // 次数 周一15次 周二5次 剩余3次；
    let countRewardDayMap = {
        0: 12, // 只有前12次会给奖励
        1: 5,
    }
    let total = 0;
    weekCount.forEach((dayCount, idx) => {
        let count = countRewardDayMap[idx] || 3;
        total += count * 5 * dayCount;
        if (targetLevel.id >= countToLevel15.id) {
            total += dayCount * targetLevel.day
        } else {
            total += dayCount * countToLevel15.day
        }
    });
    //累加周日的周结算
    total += weekCount[6] * targetLevel.week

    console.log(`----MaxTotal---${total}`);

    return total;
}


// 周一只打15次
const freeCount = (targetLevel, weekCount) => {
    // 一周七天每天打的次数 15-20-23-26-29 -32-35
    let freeWeekLevel = [countToLevel15, countToLevel20, countToLevel23, countToLevel26, countToLevel29, countToLevel32, countToLevel35]
    // 当前日期距离结束还剩下多少个周日，和其他

    // 次数 周一12次 周二5次 剩余3次；
    let countRewardDayMap = {
        0: 12,
        1: 5,
    }
    let total = 0;

    // 日结算
    weekCount.forEach((dayCount, idx) => {
        let count = countRewardDayMap[idx] || 3;
        total += count * 5 * dayCount;
        if (targetLevel.id >= freeWeekLevel[idx].id) {
            total += dayCount * freeWeekLevel[idx].day
        } else {
            total += dayCount * targetLevel.day
        }
    });

    let weekReward = targetLevel.id >= freeWeekLevel[6].id ? freeWeekLevel[6].week : targetLevel.week;
    //累加周日的周结算
    total += weekCount[6] * weekReward

    console.log(`----minTotal---${total}`);

    return total;
    // 两个极限策略
    // 1.完全不买次数
    // 2.周一买到目标段位，接下来每周至少3次，额外两次随便。（目标段位>= 时尚契合者2）
}

export default function Result({ state }: ResultProps) {
    const [resultRecord, setResultRecord] = useState({
        needCoin: 0,
        needBuyCount: 0,
        needBuyCountMonday: 0,
        needBuyCountDiamond: 0,
        getDiamond: 0,
        getCoin: 0,
        diffDay: 0,
    })


    const toCalculate = () => {
        const needCoin = toCalculateTotal(state)
        console.log(`---需要的代币total---`, needCoin);

        const targetLevel = LEVEL_LIST.find(item => item.id === state.level)
        if (!targetLevel) return null;

        const targetAndCountToLevel15DiffLevel = countToLevel15Idx - LEVEL_LIST.indexOf(targetLevel);


        const { weekCount: dayCount, diffDay } = getTheDays();
        let needBuyCount = 0;
        let needBuyCountMonday = 0;

        // 周一需要买次数
        if (targetAndCountToLevel15DiffLevel > 0 && state.strategy !== 'free') {
            needBuyCountMonday = countToLevel15ToNextLevelList[targetAndCountToLevel15DiffLevel]
            needBuyCount = dayCount[0] * needBuyCountMonday;

        }

        const minGet = freeCount(targetLevel, dayCount);
        const maxGet = strategyMondayToTarget(targetLevel, dayCount);

        const getCoinMap = {
            free: minGet,
            buyMaxCount: maxGet,
        }
        const getCoin = getCoinMap[state.strategy];

        setResultRecord({
            needCoin,
            needBuyCount,
            needBuyCountMonday,
            needBuyCountDiamond: needBuyCount * 10,
            getDiamond: diffDay * 5 * 3,
            getCoin,
            diffDay
        })
        console.log(`total`, minGet, maxGet);
    }
    console.log(`resultRecord`, resultRecord);

    return <div className="result-wrap">
        <button className="result-action" onClick={toCalculate}>开始计算</button>

        <div className="result-item">
            <div className="result-item-title">计算结果：</div>



            <p><span className="result-item-label">获得代币数量:</span>{resultRecord.getCoin}</p>
            <p><span className="result-item-label">所需代币数量:</span>{resultRecord.needCoin}</p>
            <p><span className="result-item-label">周一买次数:</span>{resultRecord.needBuyCountMonday}</p>
            <p><span className="result-item-label">消耗钻石总量:</span>{resultRecord.needBuyCountDiamond}</p>
            <p><span className="result-item-label">获得钻石总量:</span>{resultRecord.getDiamond}</p>
            <p><span className="result-item-label">赛季剩余天数:</span>{resultRecord.diffDay}</p>

            <div>

            </div>
        </div>
    </div>
}
