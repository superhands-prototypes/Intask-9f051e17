export default function App() {
  return (
    <div className="app">
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
    </div>
  )
}