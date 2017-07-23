const EventEmitter = require('events');
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

		this.emitter = new EventEmitter();

		this.state = {
			isPanning: false,
			panX: 0,
			panY: 0,
			isKnobActive: false,
			knobDimensions: null,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.modulePanCount !== nextProps.modulePanCount) {
			this.handleModulePan();
		}
	}

	handleModulePan = () => {
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
			if (this.props.activeKnob !== null) {
				const {top: topA, left: leftA} = this.state.knobDimensions;
				const {top: topB, left: leftB} = this.props.activeKnob.dimension;

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
			this.setState({
				isPanning: false,
				panX: 0,
				panY: 0,
			});

			if (this.props.activeKnob === null) {
				return;
			}

			this.props.onCreateWire({
				start: {
					dimension: this.state.knobDimensions,
					emitter: this.emitter,
				},
				end: this.props.activeKnob,
			});

			setTimeout(() => {
				this.props.onPanningStateChange(false);
			}, 0);
		}
	}

	handleKnobMouseEnter = () => {
		this.setState({
			isKnobActive: true,
		});

		this.props.onKnobMouseEnter({
			dimension: this.state.knobDimensions,
			emitter: this.emitter,
		});
	}

	handleKnobMouseLeave = () => {
		this.setState({
			isKnobActive: false,
		});

		this.props.onKnobMouseLeave();
	}

	handleResizeKnob = ({bounds}) => {
		this.setState({knobDimensions: bounds});
		this.emitter.emit('resize', bounds);
	}

	render() {
		return (
			<div styleName={classNames('io', this.props.direction)}>
				<div styleName={classNames('name', this.props.direction)}>{this.props.name}</div>
				<Wire
					direction={this.props.direction}
					mode="relative"
					x={this.state.panX}
					y={this.state.panY}
					isPanning={this.state.isPanning}
				/>
				<div
					styleName={classNames('knob', this.props.direction, {
						active: this.state.isKnobActive,
					})}
					onMouseEnter={this.handleKnobMouseEnter}
					onMouseLeave={this.handleKnobMouseLeave}
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
