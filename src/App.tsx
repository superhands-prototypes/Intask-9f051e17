import AthleteCard from './AthleteCard'
import ProgressChart from './ProgressChart'

export default function App() {
  const chartData = [
    { day: 'Mon', value: 1500, comparisonValue: 1500 },
    { day: 'Tue', value: 5500, comparisonValue: 6800 },
    { day: 'Wed', value: 1500, comparisonValue: 1500 },
    { day: 'Thu', value: 6800, comparisonValue: 1500 },
    { day: 'Fri', value: 1500, comparisonValue: 5000 },
    { day: 'Sat', value: 7800, comparisonValue: 1500 },
    { day: 'Sun', value: 1500, comparisonValue: 6200 },
  ]

  return (
    <div className="app">
      <div className="cards-stack">
        <AthleteCard 
          name="Chris Reid"
          position="Centre Back"
        />

        <div className="card">
          <div className="card-thumbnail" />

          <div className="card-body">
            <h2 className="card-title">Card title</h2>
            <p className="card-description">
              This is a short description for the card. You can use this space to
              explain what the content is about.
            </p>

            <button className="like-button" type="button">
              ♥ Like
            </button>
          </div>
        </div>

        <ProgressChart data={chartData} />
      </div>
    </div>
  )
}