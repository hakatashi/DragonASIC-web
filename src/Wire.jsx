const React = require('react');
const CSS = require('react-css-modules');
const Path = require('svg-path-generator');
const classNames = require('classnames');
const styles = require('./Wire.pcss');

class Wire extends React.Component {
	constructor(props, state) {
		super(props, state);
	}

	getPath = () => Path()
		.moveTo(0, 0)
		.relative().lineTo(this.props.x, this.props.y)
		.end()

	render() {
		return (
			<svg styleName={classNames('wire', this.props.direction)}>
				<path
					styleName="path"
					d={this.getPath()}
				/>
			</svg>
		);
	}
}

module.exports = CSS(Wire, styles, {allowMultiple: true});
