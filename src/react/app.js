import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import TagFacesIcon from 'material-ui-icons/TagFaces';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import List, {ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText} from 'material-ui/List';

class App extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            jokes: [],
            joke: ''
        };

        this.updateJokes();
	}

    handleChange(event){
        this.setState({joke: event.target.value});
    };

    updateJokes(){
        let that = this;

        fetch('/api/jokes').then(function(response) {
            return response.json();
        }).then(function(jokes) {
            console.log(jokes);
            that.setState({
                jokes: jokes.sort((a, b) => {
                    return (a['ID']['S'] > b['ID']['S']) ? -1 : ((b['ID']['S'] > a['ID']['S']) ? 1 : 0);
                })
            });
        });
    }

    deleteJoke(id){
        console.log('Delete joke', id);
        fetch(`/api/jokes/${id}`, {
            method: 'DELETE'
        }).then((data) => {
            console.log("Successful joke deleted");
            this.updateJokes();
        });
    }

    addJoke(){
        console.log('Add joke', this.state.joke);
        fetch('/api/jokes', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({joke: this.state.joke})
        }).then((data) => {
            console.log("Successful joke added");
            this.updateJokes();
        });
        this.setState({joke: ''});

    }

    getJokes(){
        return this.state.jokes.map((joke, key) => {
            return (
                <ListItem key={key}>
                  <ListItemAvatar>
                    <Avatar>
                      <TagFacesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={joke['JOKE']['S']}
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.deleteJoke.bind(this, joke['ID']['S'])}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            );
        });
    }

	render() {
		console.log("render app");
		return (
              <Grid container spacing={16}>
                <Grid item xs={12} md={6}>
                    <Typography variant="title">
                        Liste de blagues
                    </Typography>
                    <List dense={false}>
                      {this.getJokes()}
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="title">
                        Ajouter une blague
                    </Typography>
                    <TextField
                        label="Ta mère est tellement ..."
                        value={this.state.joke}
                        onChange={this.handleChange.bind(this)}
                        margin="normal"
                    />
                    <Button variant="raised" color="primary" onClick={this.addJoke.bind(this)}>
                        Ajouter
                    </Button>
                </Grid>
              </Grid>
		);
	}
}

ReactDOM.render(<App />, document.querySelector('#app-root'));
