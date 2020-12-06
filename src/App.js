import { BrowserRouter, Route, Switch } from 'react-router-dom';


import './App.css';
import Home from './pages/home/index.jsx';
import People from './pages/actors/index.jsx';
import MoivieNav from './components/Navbar/index.jsx';
import DetailsPage from './pages/detailsPage/index.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* <MoivieNav /> */}
      <Switch>
          <Route path="/" exact={true}>
              <Home />
          </Route >
          <Route path="/actors">
              <People />
          </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
