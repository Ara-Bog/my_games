import '../App.css';

export default function GameMenu() {
  return (
    <div className='menu'>
      <div className='menu__wrap'>
        <div>
          <label htmlFor="test">Тестовое поле</label>
          <input name='test' type="text" />
        </div>
      </div>
      <div className='menu__shadow'>
      </div>
    </div>
  )
}