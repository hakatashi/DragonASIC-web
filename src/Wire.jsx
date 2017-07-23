const React = require('react');
const CSS = require('react-css-modules');
const Path = require('svg-path-generator');
const classNames = require('classnames');
const styles = require('./Wire.pcss');

class Wire extends React.Component {
	constructor(props, state) {
		super(props, state);

		if (this.props.mode === 'relative') {
			this.state = {
				startX: 0,
				startY: 0,
				endX: this.props.x,
				endY: this.props.y,
			};
		} else {
			this.state = {
				startDimension: this.props.start.dimension,
				endDimension: this.props.end.dimension,
			};

			Object.assign(this.state, this.recalculateAbsoluteDimensions());
		}

		if (this.props.mode === 'absolute') {
			this.props.start.emitter.on('resize', (newDimension) => {
				this.setState({
					startDimension: newDimension,
				});

				Object.assign(this.state, this.recalculateAbsoluteDimensions());
			});
			this.props.end.emitter.on('resize', (newDimension) => {
				this.setState({
					endDimension: newDimension,
				});

				Object.assign(this.state, this.recalculateAbsoluteDimensions());
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
			this.setState({
				endX: nextProps.x,
				endY: nextProps.y,
			});
		}
	}

	recalculateAbsoluteDimensions = () => ({
		startX: this.state.startDimension.left + this.state.startDimension.width / 2,
		startY: this.state.startDimension.top + this.state.startDimension.height / 2,
		endX: this.state.endDimension.left + this.state.endDimension.width / 2,
		endY: this.state.endDimension.top + this.state.endDimension.height / 2,
	})

	getPath = () => (
		Path()
			.moveTo(this.state.startX, this.state.startY)
			.relative().curveTo(
				(this.state.endX - this.state.startX) / 2, 0,
				(this.state.endX - this.state.startX) / 2, this.state.endY - this.state.startY,
				this.state.endX - this.state.startX, this.state.endY - this.state.startY)
			.end()
	);

	render() {
		return (
			<svg styleName={classNames('wire', this.props.mode, this.props.direction)}>
				<path
					styleName="path"
					d={this.getPath()}
					style={{
						pointerEvents: this.props.isPanning ? 'none' : 'initial',
					}}
				/>
			</svg>
		);
	}
}

module.exports = CSS(Wire, styles, {allowMultiple: true});
