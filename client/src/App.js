import Button from '@material-ui/core/Button'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
function App() {
  return (
    <div className="App">
      <ButtonGroup variant="contained" >
        <Button startIcon={<SaveIcon />} color="primary">
          Save
        </Button>
        <Button startIcon={<DeleteIcon />} color="secondary">
          Discard
        </Button>
      </ButtonGroup>
      
      <h1>Todo App</h1>
      <p>Display the list of to do tasks here with basic CRUD operations</p>
    </div>
  );
}

export default App;
