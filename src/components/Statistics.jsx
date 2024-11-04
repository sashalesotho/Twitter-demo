import { useState, useEffect } from 'react'; 
import styles from '../styles/Statistics.module.css';
const Statistics = () => {

  let resStatisticDefault = '';
  const [resStatistic, setStatistic] = useState(resStatisticDefault);

  const getApiStatistic = async () => {
    const response = await fetch(
      'https://burtovoy.github.io/statistic.json'
    ).then((response) => response.json());
  
    setStatistic(response.statistic);
  };

  useEffect(() => {
    getApiStatistic();
  }, []);

    return(
        <>
        <img className = {styles.image} src="images/people.png" alt="люди" />
        <div className = {styles.statistics}>
        <div className = {styles.statistics__item}>
          <div className = {styles.statistics__number}>{resStatistic.usersRegistr}</div>
          <div className = {styles.statistics__text}>Пользователей зарегистрировано</div>
        </div>
        <div className = {styles.statistics__item}>
          <div className = {styles.statistics__number}>{resStatistic.writMessages}</div>
          <div className = {styles.statistics__text}>Сообщений написано</div>
        </div>
        <div className = {styles.statistics__item}>
          <div className = {styles.statistics__number}>{resStatistic.writToday}</div>
          <div className = {styles.statistics__text}>Написано сегодня</div>
        </div>
      </div>
        </>
        
    )
}
export default Statistics;