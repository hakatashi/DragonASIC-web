const React = require('react');
const CSS = require('react-css-modules');
const Path = require('svg-path-generator');
const classNames = require('classnames');
const styles = require('./Wire.pcss');

class Wire extends React.Component {
	constructor(props, state) {
		super(props, state);

		this.state = {
			startX: this.props.mode === 'relative'
				? 0
				: this.props.start.dimension.left + this.props.start.dimension.width / 2,
			startY: this.props.mode === 'relative'
				? 0
				: this.props.start.dimension.top + this.props.start.dimension.height / 2,
			endX: this.props.mode === 'relative'
				? this.props.x
				: this.props.end.dimension.left + this.props.start.dimension.width / 2,
			endY: this.props.mode === 'relative'
				? this.props.y
				: this.props.end.dimension.top + this.props.start.dimension.height / 2,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
			this.setState({
				endX: nextProps.x,
				endY: nextProps.y,
			});
		}
	}

	getPath = () => Path()
		.moveTo(this.state.startX, this.state.startY)
		.relative().curveTo(
			(this.state.endX - this.state.startX) / 2, 0,
			(this.state.endX - this.state.startX) / 2, this.state.endY - this.state.startY,
			this.state.endX - this.state.startX, this.state.endY - this.state.startY)
		.end();

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
