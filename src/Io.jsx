const React = require('react');
const CSS = require('react-css-modules');
const Hammer = require('react-hammerjs');
const {INPUT_MOVE, INPUT_END} = (typeof window === 'undefined') ? {} : require('hammerjs');
const classNames = require('classnames');
const Wire = require('./Wire.jsx');

const styles = require('./Io.pcss');

class Io extends React.Component {
	constructor(props, state) {
		super(props, state);

		this.state = {
			isPanning: false,
			panX: 0,
			panY: 0,
			isButtonActive: false,
		};
	}

	handlePan = (event) => {
		event.preventDefault();

		const distance = event.distance;
		const angle = event.angle / 180 * Math.PI;
		const x = distance * Math.cos(angle);
		const y = distance * Math.sin(angle);

		if (event.eventType === INPUT_MOVE) {
			if (this.props.activeButton !== null) {
				const {top: topA, left: leftA} = this.buttonNode.getBoundingClientRect();
				const {top: topB, left: leftB} = this.props.activeButton.getBoundingClientRect();

				this.setState({
					isPanning: true,
					panX: leftB - leftA,
					panY: topB - topA,
				});

				return;
			}

			this.setState({
				isPanning: true,
				panX: x,
				panY: y,
			});

			this.props.onPanningStateChange(true);
		} else if (event.eventType === INPUT_END) {
			if (this.props.activeButton === null) {
				this.setState({
					isPanning: false,
					panX: 0,
					panY: 0,
				});

				return;
			}

			this.setState({
				isPanning: false,
			});

			setTimeout(() => {
				this.props.onPanningStateChange(false);
			}, 0);
		}
	}

	handleButtonMouseEnter = (event) => {
		this.setState({
			isButtonActive: true,
		});
		this.props.onButtonMouseEnter(event);
	}

	handleButtonMouseLeave = (event) => {
		this.setState({
			isButtonActive: false,
		});
		this.props.onButtonMouseLeave(event);
	}

	render() {
		return (
			<div styleName={classNames('io', this.props.direction)}>
				<div styleName="name">{this.props.name}</div>
				<Wire
					direction={this.props.direction}
					x={this.state.panX}
					y={this.state.panY}
					isPanning={this.state.isPanning}
				/>
				<Hammer onPan={this.handlePan} options={{domEvents: true}}>
					<div
						ref={(node) => {
							this.buttonNode = node;
						}}
						styleName={classNames('button', {active: this.state.isButtonActive})}
						onMouseEnter={this.handleButtonMouseEnter}
						onMouseLeave={this.handleButtonMouseLeave}
					/>
				</Hammer>
			</div>
		);
	}
}

module.exports = CSS(Io, styles, {allowMultiple: true});
