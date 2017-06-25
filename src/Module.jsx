const React = require('react');
const CSS = require('react-css-modules');
const Hammer = require('react-hammerjs');
const {INPUT_MOVE, INPUT_END} = (typeof window === 'undefined') ? {} : require('hammerjs');
const styles = require('./Module.pcss');

class Module extends React.Component {
	constructor(props, state) {
		super(props, state);

		this.state = {
			x: props.initialX,
			y: props.initialY,
			isPanning: false,
			panDistance: null,
			panAngle: null,
		};
	}

	handlePan = (event) => {
		event.preventDefault();

		const distance = event.distance;
		const angle = event.angle / 180 * Math.PI;

		if (event.eventType === INPUT_MOVE) {
			this.setState({
				isPanning: true,
				panDistance: distance,
				panAngle: angle,
			});
		} else if (event.eventType === INPUT_END) {
			this.setState({
				isPanning: false,
				x: this.state.x + distance * Math.cos(angle),
				y: this.state.y + distance * Math.sin(angle),
			});
		}
	}

	getCoordinates = () => {
		if (this.state.isPanning) {
			return {
				x: this.state.x + this.state.panDistance * Math.cos(this.state.panAngle),
				y: this.state.y + this.state.panDistance * Math.sin(this.state.panAngle),
			};
		}

		return {
			x: this.state.x,
			y: this.state.y,
		};
	}

	render() {
		const {x, y} = this.getCoordinates();

		return (
			<Hammer onPan={this.handlePan}>
				<div
					styleName="module"
					style={{
						transform: `translate(${x}px, ${y}px)`,
					}}
				>
					<div styleName="name" contentEditable={true}>{this.props.name}</div>
				</div>
			</Hammer>
		);
	}
}

module.exports = CSS(Module, styles);
