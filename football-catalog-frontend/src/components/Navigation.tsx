import { Link } from "react-router-dom";
import '../assets/style/Navigation.scss'

const Navigation = () => {
  return (
    <nav className='Nav'>
      <Link to='/' className='Nav-item'>
        Добавить футболиста
      </Link>
      <div className='Nav-item'>
        Каталог футболистов 3.0
      </div>
      <Link to='/list' className='Nav-item'>
        Список футболистов
      </Link>
    </nav>
  );
};

export default Navigation;
