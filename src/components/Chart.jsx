import { Scatter } from 'react-chartjs-2';

const NUMBER_OF_VISIBLE_WEEKS = 20;

const startDate = new Date()

const Chart = ({ datasets, currentWeek }) => {
  const options = {
    fill: true,
    animation: false,
    legend: {
      display: false
    },
    tooltips: {
        enabled: false
    },
    scales: {
       xAxes: [{
          type: 'linear',
          ticks: {
            min: currentWeek - NUMBER_OF_VISIBLE_WEEKS,
            max: currentWeek,
            callback: (value) => value % 1
              ? undefined
              : new Date(new Date().setDate(startDate.getDate() + 7 * value)).toJSON().substring(0, 10),
          },
          gridLines: {
            drawBorder: false,
          },
       }],
       yAxes: [{
          type: 'linear',
          ticks: {
            reverse: true,
            min: 0,
            max: 100,
          }
       }],
    }
}

  return <Scatter data={{ datasets }} options={options} />
}

export default Chart