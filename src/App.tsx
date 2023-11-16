import {useState, useEffect } from 'react';
// import logo from './logo.svg';
import useKeyPress from './logical/KeyPressHook';
import './App.css';

type DiceValues = {
  [n:number]: number;
};

type BotWeights = {
  kDice: number;
  kScore: number;
}

interface botStructur {
  curScore: number;
  totalScore: number;
  readonly weights: DiceValues;
  move(dices: DiceValues): boolean;
  selectDices(): number[];
}

const calcChanceDices = (weights: DiceValues):DiceValues => {
  let diceBorderChance:DiceValues = {};
  diceBorderChance[1] = weights[1];
  for (let i = 2; i <= 6; i++) {
    diceBorderChance[i] = diceBorderChance[i - 1] + weights[i];
  }

  return diceBorderChance
}


class BotEasy implements botStructur {
  readonly weights: BotWeights = {
    kDice: 0.1,
    kScore: 10,
  };

  constructor(public totalScore: number, public curScore: number) {}

  move(dices: DiceValues): boolean {
    return true
  }

  selectDices(): number[] {
    return []
  }
}

const diceWeights: DiceValues = {1: 16.6, 2: 16.6, 3: 16.6, 4: 16.6, 5: 16.6, 6: 16.6};

export default function App() {
  const currentKey: string = useKeyPress();
  const [userMove, setUserMove] = useState<boolean>(true);
  const [hoverDice, setHoverDice] = useState<number>(0);

  const [selectDicesUser, setSelectDicesUser] = useState<number[]>([]);
  const [selectDicesBot, setSelectDicesBot] = useState<number[]>([]);

  const [userDices, setUserDices] = useState<DiceValues>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
  const [botDices, setBotDices] = useState<DiceValues>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});

  const [userTotal, setUserTotal] = useState<number>(0);
  const [botTotal, setBotTotal] = useState<number>(0);

  const [userScore, setUserScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);

  const [userSelectScore, setUserSelectScore] = useState<number>(0);
  const [botSelectScore, setBotSelectScore] = useState<number>(0);

  const [amountDices, setAmountDices] = useState<number>(6);

  useEffect(() => {
    if (userMove) {
      switch (currentKey.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          let nextDice = hoverDice - 1;
          setHoverDice(nextDice >= 0 ? nextDice : 5);
          break;
        case 'd':
        case 'arrowright':
          let prevDice = hoverDice + 1;
          setHoverDice(prevDice <= 5 ? prevDice : 0);
          break;
        case 'e':
          handleDice(hoverDice);
          break;
        case 'f':
          if (userSelectScore > 0) {
            commitMove();
          }
          break;
        case 'q':
          if (userSelectScore > 0) {
            finishMove();
          }
          break;
      }
    }
  }, [currentKey])

  const rollDices = (newAmount:number = amountDices) => {
    let chenchedDices: number = 0;
    let borders: DiceValues = calcChanceDices(diceWeights);
    let newDices: DiceValues = {};
    let countDices: DiceValues = {};

    while (chenchedDices < newAmount) {
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

    if (calcScore(countDices) === 0) {
      clear();
      setUserMove(!userMove);
    } else {
      if (userMove) {
        setUserDices(newDices);
      } else {
        setBotDices(newDices);
      }
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
    let vals: number[] = selectedList.map(item => userDices[item + 1]);
    let dict: DiceValues = {};

    for (const num of vals) {
      dict[num] ??= 0;
      dict[num] += 1;
    }

    setUserSelectScore(calcScore(dict, true))
  }

  const clear = () => {
    setUserScore(0);
    setBotScore(0);

    setUserSelectScore(0);
    setBotSelectScore(0);

    setSelectDicesUser([]);
    setSelectDicesBot([]);

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
    
    let newAmount = (amountDices - selectDicesUser.length) || 6;

    setAmountDices(newAmount);

    setHoverDice(0);

    rollDices(newAmount);
  }

  const finishMove = () => {
    setUserTotal(userTotal + userScore + userSelectScore);
    setBotTotal(botTotal + botScore + botSelectScore);

    clear();

    setUserMove(!userMove);
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

  const RowDices = (selected: number[], dices: DiceValues, amount: number) => {
    return Array.from({length: amount}, (_, key) => {
      return (
        <div onClick={() => (handleDice(key), setHoverDice(key))} key={key} className={`dice ${key === hoverDice ? 'dice--active' : null} ${selected.includes(key) ? 'dice--selected' : null}`}>
          {Array.from({length: dices[key + 1]}, (_, keyPin) => {return <div key={`${key}_${keyPin}`} className='pin'></div>})}
        </div>
      )
    })
  }

  return (
    <main className='main'>
      <button onClick={() => rollDices()}>ЭТА КНОПКА ШОБЫ РОЛИТЬ, ПАТОМ УБЕРУ</button>
      <div className='rowDices'>
        {RowDices(selectDicesBot, botDices, userMove ? 0 : amountDices)}
      </div>
      <div>
        <span>Счет бота</span>
        <p>Всего: {botTotal}</p>
        <p>Раунд: {botScore}</p>
        <p>Взято: {botSelectScore}</p>
      </div>
      <p>{userMove ? 'Ваш ход' : 'Ход противника'}</p>
      <div>
        <span>Твой счет</span>
        <p>Всего: {userTotal}</p>
        <p>Раунд: {userScore}</p>
        <p>Взято: {userSelectScore}</p>
      </div>
      <div className='rowDices'>
        {RowDices(selectDicesUser, userDices, userMove ? amountDices : 0)}
      </div>
      <div>
        <span>Управление</span>
        <p>E - выбрать кость</p>
        <p>F - взять кости и ролл</p>
        <p>Q - взять кости закончить ход</p>
        <p>A/ArrowLeft D/ArrowRight - переключение между костями</p>
      </div>
    </main>
  )
}
