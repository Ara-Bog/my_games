import {useState, useEffect } from 'react';
// import logo from './logo.svg';
import useKeyPress from './logical/KeyPressHook';
import { setPowerset, combinations } from 'mathjs';
import './App.css';

type DiceValues = {
  [n:number]: number;
};

type diceForBot = {score: number, dices: number[], powerWay: number};

type COMPLEXITY_TYPES = 'EASY' | 'MID' | 'HARD';
type COMPLEXITY_VALUES = {kScore: number, kDice: number};

type Complexity = {
  [key in COMPLEXITY_TYPES] : COMPLEXITY_VALUES
}

type STATUSES  = 'PLAY' | 'USER_MOVE' | 'BOT_MOVE' | 'ANIMATION' | 'ANIMATION_END' | 'PAUSE' | 'MENU';


// type BotWeights = {
//   kDice: number;
//   kScore: number;
// }

// interface botStructur {
//   curScore: number;
//   totalScore: number;
//   readonly weights: DiceValues;
//   move(dices: DiceValues): boolean;
//   selectDices(): number[];
// }

// class BotEasy implements botStructur {
//   readonly weights: BotWeights = {
//     kDice: 0.1,
//     kScore: 10,
//   };

//   constructor(public totalScore: number, public curScore: number) {}

//   move(dices: DiceValues): boolean {
//     return true
//   }

//   selectDices(): number[] {
//     return []
//   }
// }

const calcChanceDices = (weights: DiceValues):DiceValues => {
  let diceBorderChance:DiceValues = {};
  diceBorderChance[1] = weights[1];
  for (let i = 2; i <= 6; i++) {
    diceBorderChance[i] = diceBorderChance[i - 1] + weights[i];
  }

  return diceBorderChance
}

const complexityBots: Complexity = {
                                    'EASY': {kScore: 10, kDice: 0.1}, 
                                    'MID': {kScore: 9, kDice: 2},
                                    'HARD': {kScore: 8, kDice: 3}
                                  };

const diceWeights: DiceValues = {1: 16.6, 2: 16.6, 3: 16.6, 4: 16.6, 5: 16.6, 6: 16.6};
const chanceForBot: DiceValues = {1: 0.33,
  2: 0.5555555555555556,
  3: 0.7222222222222221,
  4: 0.8425925925925923,
  5: 0.9228395061728395,
  6: 0.9691358024691356,
  } 

export default function App() {
  const currentKey: string = useKeyPress();
  const [userMove, setUserMove] = useState<boolean>(true);
  const [hoverDice, setHoverDice] = useState<number>(0);
  const [limitScore, setLimitScore] = useState<number>(4000);

  const [selectDicesUser, setSelectDicesUser] = useState<number[]>([]);
  const [selectDicesBot, setSelectDicesBot] = useState<number[]>([]);
  const [currentIndexSelected, setCurrentIndexSelected] = useState<number>(0);
  const [newSelectedBot, setNewSelectedBot] = useState<number[]>([]);
  const [botFinish, setBotFinish] = useState<boolean>(false);

  const [userDices, setUserDices] = useState<DiceValues>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
  const [botDices, setBotDices] = useState<DiceValues>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
  const [counterDices, setCounterDices] = useState<DiceValues>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});

  const [userTotal, setUserTotal] = useState<number>(0);
  const [botTotal, setBotTotal] = useState<number>(0);

  const [userScore, setUserScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);

  const [userSelectScore, setUserSelectScore] = useState<number>(0);
  const [botSelectScore, setBotSelectScore] = useState<number>(0);

  const [amountDices, setAmountDices] = useState<number>(6);

  const [complexityBot, setComplexityBot] = useState<COMPLEXITY_TYPES>('EASY');

  const [gameStatus, setGameStatus] = useState<STATUSES>('PLAY');

  useEffect(() => {
    if (userMove) {
      switch (currentKey.toLowerCase()) {
        case 'a':
        case 'ф':
        case 'arrowleft':
          let nextDice = hoverDice - 1;
          setHoverDice(nextDice >= 0 ? nextDice : 5);
          break;
        case 'd':
        case 'в':
        case 'arrowright':
          let prevDice = hoverDice + 1;
          setHoverDice(prevDice <= 5 ? prevDice : 0);
          break;
        case 'e':
        case 'у':
          handleDice(hoverDice);
          break;
        case 'f':
        case 'а':
          if (userSelectScore > 0) {
            commitMove();
          }
          break;
        case 'q':
        case 'й':
          if (userSelectScore > 0) {
            finishMove();
          }
          break;
      }
    }
  }, [currentKey])

  const botSelectDice = () => {
    if (currentIndexSelected < newSelectedBot.length) {
      const newElement = newSelectedBot[currentIndexSelected];
      handleDice(newElement);
      setCurrentIndexSelected(prevIndex => prevIndex + 1);
    } else {
      setGameStatus('ANIMATION_END')
    }
  } 

  useEffect(() => {
    if (newSelectedBot.length !== 0) {
      const timer = setTimeout(botSelectDice, 1500);
  
      return () => clearTimeout(timer);
    }
  }, [selectDicesBot, newSelectedBot, currentIndexSelected])

  const rollDices = () => {
    let chenchedDices: number = 0;
    let borders: DiceValues = calcChanceDices(diceWeights);
    let newDices: DiceValues = {};
    let countDices: DiceValues = {};

    while (chenchedDices < amountDices) {
      let chance: number = Math.floor(Math.random() * 100);

      for (let i: number = 1; i <= 6; i++) {
        if (chance < borders[i]) {
          chenchedDices += 1;

          countDices[i] ??= 0;
          countDices[i] += 1;

          newDices[chenchedDices] = i;
          break;
        }
      }
    }

    if (calcScore(JSON.parse(JSON.stringify(countDices))) === 0) {
      clear();
      setUserMove(!userMove);
      setGameStatus('PLAY');
    } else {
      if (userMove) {
        setUserDices(newDices);
      } else {
        setBotDices(newDices);
      }
      setCounterDices(countDices)
    }
  }

  const calcScore = (countDices: DiceValues, checkStash: boolean = false): number => {
    let score:number = 0;
    let uniqueDices: number[] = Object.keys(countDices).map(Number);
    let decreace: boolean = false;

    switch (uniqueDices.length) {
      case 5:
        let summ:number = uniqueDices.reduce((acc:number, a:number) => acc += a);
        if (summ === 20) {
          score += 750;
          decreace = true;
        } else if (summ === 15) {
          score += 500;
          decreace = true;
        }
        break;
      case 6:
        score += 1500;
        uniqueDices = [];
        countDices = {};
        break;
    }

    for (const key of uniqueDices) {
      let val:number = countDices[key];
      if (val > 2) {
        let defVal: number = key === 1 ? 1000 : Number(key) * 100;
        score += defVal * (2**(val - 3))
        countDices[key] = 0;
      } else if (decreace) {
        countDices[key] -= 1;
      }
      if (countDices[key] === 0) {
        delete countDices[key];
      }
    }

    score += (countDices[1] || 0) * 100;
    delete countDices[1];
    score += (countDices[5] || 0) * 50;
    delete countDices[5];
    return checkStash ? (Object.values(countDices).length === 0 ? score : 0) : score
  }
 
  const cahngeScore = (selectedList: number[]) => {
    let selectDices: DiceValues = userMove ? userDices : botDices;
    let vals: number[] = selectedList.map(item => selectDices[item + 1]);
    let dict: DiceValues = {};

    for (const num of vals) {
      dict[num] ??= 0;
      dict[num] += 1;
    }

    let score: number = calcScore(dict, true);

    if (userMove) {
      setUserSelectScore(score);
    } else {
      setBotSelectScore(score);
    }
  }

  const clear = () => {
    setUserScore(0);
    setBotScore(0);

    setUserSelectScore(0);
    setBotSelectScore(0);

    setSelectDicesUser([]);
    setSelectDicesBot([]);
    setNewSelectedBot([]);
    setCurrentIndexSelected(0);

    setAmountDices(6);
    setHoverDice(0);

    setBotDices({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
    setUserDices({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
  }

  const commitMove = () => {
    setUserScore(userScore + userSelectScore);
    setBotScore(botScore + botSelectScore);

    setUserSelectScore(0);
    setBotSelectScore(0);

    setSelectDicesUser([]);
    setSelectDicesBot([]);
    setNewSelectedBot([]);
    setCurrentIndexSelected(0);
    
    setAmountDices((amountDices - (userMove ? selectDicesUser.length : selectDicesBot.length)) || 6);

    setHoverDice(0);
    setGameStatus('PLAY');
  }

  const finishMove = () => {
    setUserTotal(userTotal + userScore + userSelectScore);
    setBotTotal(botTotal + botScore + botSelectScore);

    clear();

    setUserMove(!userMove);
    setGameStatus('PLAY');
  }

  const botLogical = (): number[] => {
    let allDices: number[] = Object.values(botDices);
    let weights: COMPLEXITY_VALUES = complexityBots[complexityBot];
    let currentDices: number[] = Object.keys(counterDices).map(Number);
    let combinations: diceForBot[] = [];
    let needToWin:number = limitScore - botTotal - botScore;

    let bestWay: diceForBot = {score: -Infinity, dices: [], powerWay: -Infinity};
    
    for (let dice of currentDices) {
      let val:number = counterDices[dice];
      if (val > 2) {
        let defVal: number = dice === 1 ? 20 : dice * 2;
        let score: number = defVal * (2**(val - 3));
        let newComb: diceForBot = {score: score, dices: new Array(val).fill(dice), powerWay: score - val * weights.kDice};

        if (score >= needToWin) {
          setBotFinish(true);
          return newComb.dices;
        }

        if (newComb.powerWay > bestWay.powerWay) {
          bestWay = newComb;
        }
        combinations.push(newComb);
      }
    }

    let summCountByComb:number = combinations.reduce((acc, item) => acc + item.dices.length, 0);
    
    let summCountTotal:number = summCountByComb;
    if (counterDices[1] < 3) {
      summCountTotal += counterDices[1];
    }
    if (counterDices[5] < 3) {
      summCountTotal += counterDices[5];
    }

    if (summCountTotal === amountDices) {
      setBotFinish(true);
      return allDices;
    }

    if (currentDices.length === 6) {
      setBotFinish(false);
      return allDices;
    } 

    if (currentDices.length > 5) {
      let summElements: number = currentDices.reduce((acc, a) => acc + a, 0);
      let exit: boolean = true;
      let flagFinish: boolean = true;
      let list: number[] = [];
      if (summElements === 20) {
        if ((currentDices.length - 1 + counterDices[5]) === amountDices) {
          list = allDices;
          flagFinish = false;
        } else {
          list = currentDices;
        }
      } else if (summElements === 15) {
        if ((currentDices.length - 2 + counterDices[1] + counterDices[5]) === amountDices) {
          list = allDices;
          flagFinish = false;
        } else {
          list = currentDices;
        }

      } else {
        exit = false;
      }
      
      if (exit) {
        setBotFinish(flagFinish);
        return list;
      }
    }

    let powerSet: number[][] = setPowerset([...new Array(counterDices[1] < 3 ? counterDices[1] : 0).fill(1), ...new Array(counterDices[5] < 3 ? counterDices[5] : 0).fill(5)])
    powerSet = powerSet.slice(1).filter((item, index) => powerSet[index].toString() !== item.toString());

    for (let powS of powerSet) {
      let scoreNewDice: number = powS.reduce((acc, a) => acc + (a === 1 ? 2 : 1), 0);
      let combByPower: diceForBot = {score: scoreNewDice, dices: [...powS], powerWay: scoreNewDice - powS.length * weights.kDice};

      if (scoreNewDice >= needToWin) {
        setBotFinish(true);
        return combByPower.dices;
      }
      
      if (combByPower.powerWay > bestWay.powerWay) {
        bestWay = combByPower;
      }

      for (let comb of combinations) {
        let newScore: number = combByPower.score + comb.score;
        let newComb: diceForBot = {score: newScore, dices: [...combByPower.dices, ...comb.dices], powerWay: newScore - (powS.length + comb.dices.length) * weights.kDice};

        if (newScore >= needToWin) {
          setBotFinish(true);
          return newComb.dices;
        }

        if (newComb.powerWay > bestWay.powerWay) {
          bestWay = newComb;
        }
      }
    }

    let rem: number = (amountDices - bestWay.dices.length);
    if (rem === 0) {
      setBotFinish(false);
    } else {
      let weigtScore = (botSelectScore / 50 + bestWay.score) / 160 * weights.kScore;
      setBotFinish(weigtScore > chanceForBot[rem]);
    }
    return bestWay.dices
  }

  const handleDice = (key:number) => {
    let selectedList: number[] = userMove ? [...selectDicesUser] : [...selectDicesBot];
    let ind: number = selectedList.indexOf(key);

    if (ind >= 0) {
      selectedList.splice(ind, 1);
    } else {
      selectedList.push(key);
    }

    if (userMove) {
      setSelectDicesUser(selectedList);
    } else {
      setSelectDicesBot(selectedList);
    }
    cahngeScore(selectedList);
  }

  const moveBot = () => {
    let answer: number[] = botLogical();
    let allDices: number[] = Object.values(botDices);
    let out: number[] = answer.map(item => {let ind = allDices.indexOf(item); allDices[ind] = -1; return ind})
    setNewSelectedBot(out);
    setGameStatus('PAUSE');
  }

  const RowDices = (selected: number[], dices: DiceValues, amount: number) => {
    return Array.from({length: amount}, (_, key) => {
      return (
        <div onClick={() => (handleDice(key), setHoverDice(key))} key={key} className={`dice ${key === hoverDice ? 'dice--active' : null} ${selected.includes(key) ? 'dice--selected' : null}`}>
          {Array.from({length: dices[key + 1]}, (_, keyPin) => {return <div key={`${key}_${keyPin}`} className='pin'></div>})}
        </div>
      )
    })
  }

  switch (gameStatus) {
    case 'PLAY':
      setGameStatus(userMove ? 'USER_MOVE' : 'BOT_MOVE');
      rollDices();
      break;
    case 'BOT_MOVE':
      moveBot()
      break;
    case 'USER_MOVE':
      break;
    case 'ANIMATION_END':
      if (botFinish) {
        finishMove()
      } else {
        commitMove()
      }
      break;
    case 'MENU':
      break;
    case 'PAUSE':
      break;
  }

  return (
    <main className='main'>
      {/* <button onClick={() => setGameStatus('PLAY')}>HUI</button> */}
      <div className='rowDices'>
        {RowDices(selectDicesBot, botDices, userMove ? 0 : amountDices)}
      </div>
      <div className='boxScore'>
        <p>Всего: {botTotal}</p>
        <p>Раунд: {botScore}</p>
        <p>Взято: {botSelectScore}</p>
      </div>
      <h1 style={{textAlign: 'center'}}>{userMove ? 'Ваш ход' : 'Ход противника'}</h1>
      <div style={{display: 'flex'}}>
        <div className='boxScore'>
          <p>Всего: {userTotal}</p>
          <p>Раунд: {userScore}</p>
          <p>Отобрано: {userSelectScore}</p>
        </div>
        <div className='control'>
          <p>Отложить кость<span>E</span></p>
          <p>Записать счет и бросить снова<span>F</span></p>
          <p>Записать счет и передача хода<span>Й</span></p>
          <p>Выбор кости<span>A/D<br />ArrowL/ArrowR</span></p>
        </div>
      </div>
      <div className='rowDices'>
        {RowDices(selectDicesUser, userDices, userMove ? amountDices : 0)}
      </div>
    </main>
  )
}
