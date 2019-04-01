import React, { Component } from 'react';
import './App.css';
import squirrel from './assets/squirrel.jpg';
import { Container, Header, Segment } from 'semantic-ui-react';
import ImageCropper from './components/imageCropper';


class App extends Component {
	constructor(props) {
		super(props);
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDrop = this.handleDrop.bind(this);

	}

	render() {
		return (
			<div className='App' onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
				<Container>
					<Segment><Header as='h1'>Please draw a path to create a puzzle piece</Header></Segment>
					<ImageCropper imageSrc={squirrel}/>
				</Container>
			</div>
		);
	}


	handleDragOver(event) {
		event.preventDefault();
		return false;
	}

	handleDrop(event) {
		const draggable = document.getElementById('cropped');
		const offset = event.dataTransfer.getData('text/plain').split(',');

		draggable.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
		draggable.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
		event.preventDefault();
		return false;
	}
}

export default App;
