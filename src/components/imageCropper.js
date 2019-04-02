import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import DraggableShape from './draggableShape';

class ImageCropper extends Component {
	constructor(props) {
		super(props);
		this.resetShape = this.resetShape.bind(this);
		this.cropShape = this.cropShape.bind(this);
		this.draw = this.draw.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.setPoints = this.setPoints.bind(this);
		this.drawImage = this.drawImage.bind(this);

		this.state = { shape: [], draw: false, croppedSrc: null };
		this.canvasWidth = 640;
		this.canvasHeight = 425;
		this.points = {
			prevX: 0, currX: 0, prevY: 0, currY: 0
		};
	}

	componentDidMount() {
		const img = this.refs.image;

		img.onload = () => {
			this.drawImage()
		}
	}

	render() {
		const { imageSrc } = this.props;
		const lastClickedPoint = this.state.shape[this.state.shape.length -1];

		return <div>
			<canvas ref='canvas' onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove}
			        className='image-crop-canvas'
			        width={this.canvasWidth} height={this.canvasHeight}/>
			<img ref={'image'} src={imageSrc} className='hidden' alt=''/>
			<DraggableShape onClose={this.resetShape} src={this.state.croppedSrc} initialPosition={lastClickedPoint}/>
			<Button onClick={this.resetShape} className='reset-button'>Reset</Button>
		</div>;
	}

	resetShape() {
		this.setState({ shape: [], croppedSrc: null });
		this.clearCrop();
	}

	onMouseMove(e) {
		if (this.state.draw) {
			this.setPoints(e);
			this.draw();
		}
	}

	onMouseDown(e) {
		this.setState({ draw: true });
		this.start = true;
		this.setPoints(e);
	}

	setPoints(e) {
		const canvas = this.refs.canvas;

		this.points.prevX = this.points.currX;
		this.points.prevY = this.points.currY;
		this.points.currX = parseInt(e.clientX - canvas.offsetLeft);
		this.points.currY = parseInt(e.clientY - canvas.offsetTop);
		this.setState({ shape: [ ...this.state.shape, { x: this.points.currX, y: this.points.currY } ] });

	}

	onMouseUp() {
		const dx = this.points.currX - this.state.shape[0].x;
		const dy = this.points.currY - this.state.shape[0].y;

		if (dx * dx + dy * dy < 1000) {
			this.cropShape();
		} else {
			this.resetShape();
		}

		this.setState({ draw: false });
	}

	draw() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext('2d');
		const { currX, currY, prevX, prevY } = this.points;

		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
	}

	clearCrop() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.drawImage();
	}

	cropShape() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext('2d');
		const img = this.refs.image;

		const { shape } = this.state;
		let minX = 10000;
		let minY = 10000;
		let maxX = -10000;
		let maxY = -10000;

		for (let i = 1; i < shape.length; i++) {
			const p = shape[i];
			if (p.x < minX) {
				minX = p.x;
			}
			if (p.y < minY) {
				minY = p.y;
			}
			if (p.x > maxX) {
				maxX = p.x;
			}
			if (p.y > maxY) {
				maxY = p.y;
			}
		}
		const width = maxX - minX;
		const height = maxY - minY;

		ctx.save();
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		ctx.beginPath();
		ctx.moveTo(shape[0].x, shape[0].y);

		for (let i = 1; i < shape.length; i++) {
			ctx.lineTo(shape[i].x, shape[i].y);
		}
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(img, 0, 0);
		ctx.restore();


		const croppedCanvas = document.createElement('canvas');
		const cx = croppedCanvas.getContext('2d');

		croppedCanvas.width = width;
		croppedCanvas.height = height;

		cx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);

		this.setState({ croppedSrc: croppedCanvas.toDataURL() });

		this.drawImage();

		ctx.fillStyle = 'grey';
		ctx.fill();
	}

	drawImage(alpha = 1) {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext('2d');
		const img = this.refs.image;

		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		ctx.globalAlpha = alpha;
		ctx.drawImage(img, 0, 0);
		ctx.globalAlpha = 1.00;
	}

}

export default ImageCropper;