const React = require('react');
const CSS = require('react-css-modules');
const Hammer = require('react-hammerjs');
const {default: Measure} = require('react-measure');
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
			knobDimensions: null,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isModulePanning === true && nextProps.isModulePanning === false) {
			this.handleModulePanEnd();
		}
	}

	handleModulePanEnd = () => {
		if (this.measure) {
			this.measure();
		}
	}

	handlePan = (event) => {
		event.preventDefault();

		const distance = event.distance;
		const angle = event.angle / 180 * Math.PI;
		const x = distance * Math.cos(angle);
		const y = distance * Math.sin(angle);

		if (event.eventType === INPUT_MOVE) {
			if (this.props.activeButton !== null) {
				const {top: topA, left: leftA} = this.state.knobDimensions;
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

	handleResizeKnob = ({bounds}) => {
		this.setState({knobDimensions: bounds});
	}

	render() {
		return (
			<div styleName={classNames('io', this.props.direction)}>
				<div styleName={classNames('name', this.props.direction)}>{this.props.name}</div>
				<Wire
					direction={this.props.direction}
					x={this.state.panX}
					y={this.state.panY}
					isPanning={this.state.isPanning}
				/>
				<div
					styleName={classNames('knob', this.props.direction, {
						active: this.state.isButtonActive,
					})}
					onMouseEnter={this.handleButtonMouseEnter}
					onMouseLeave={this.handleButtonMouseLeave}
				>
					<Hammer onPan={this.handlePan} options={{domEvents: true}}>
						<div styleName="click-area"/>
					</Hammer>
					<Measure bounds={true} onResize={this.handleResizeKnob}>
						{({measureRef, measure}) => {
							this.measure = measure;
							return <div className="measure-area" ref={measureRef}/>;
						}}
					</Measure>
				</div>
			</div>
		);
	}
}

module.exports = CSS(Io, styles, {allowMultiple: true});
