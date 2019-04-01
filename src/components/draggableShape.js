import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react'

class DraggableShape extends Component {
	constructor(props) {
		super(props);
		this.onDragStart = this.onDragStart.bind(this);
		this.state = {isDragStarted: false};
	}

	onDragStart(event) {
		const style = window.getComputedStyle(event.currentTarget, null);
		const left = style.getPropertyValue('left');
		const top = style.getPropertyValue('top');
		event.dataTransfer.setData('text/plain',
			`${(parseInt(left, 10) - event.clientX)},${(parseInt(top, 10) - event.clientY)}`);
		this.setState({isDragStarted: true});
	};

	render() {
		const { onClose, src } = this.props;
		let style = {};
		if (this.state.isDragStarted) {
			style = {position: 'absolute'}
		} else {
			style = {position: 'relative'};
		}

		if (!src) {
			return null;
		}
		return (
			<div className='draggable-shape' draggable onDragStart={this.onDragStart} id='cropped' style={style}>
				<Icon name='times' onClick={onClose} className='icon' size='large'/>
				<img src={src} alt=''/>
			</div>
		);
	}

}

export default DraggableShape;