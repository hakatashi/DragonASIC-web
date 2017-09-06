const React = require('react');
const CSS = require('react-css-modules');
const styles = require('./InfoArea.pcss');

require('brace/mode/c_cpp');
require('brace/theme/monokai');

class InfoArea extends React.Component {
	constructor(props, state) {
		super(props, state);

		this.state = {
			modules: [],
			wires: [],
		};
	}

	handleDoubleTap = (event) => {
		this.setState({
			modules: this.state.modules.concat([{
				uid: Math.floor(Math.random() * 1e10).toString(),
				initialX: event.center.x,
				initialY: event.center.y,
			}]),
		});
	}

	handleCreateWire = ({start, end}) => {
		this.setState({
			wires: this.state.wires.concat([{
				uid: Math.floor(Math.random() * 1e10).toString(),
				start,
				end,
			}]),
		});
	}

	render() {
		return (
			<div styleName="info-area">
				<div styleName="logo-area">
					<img src="logo.svg" alt="DragonASIC"/>
				</div>
				<div styleName="head">Serial Output</div>
			</div>
		);
	}
}

module.exports = CSS(InfoArea, styles, {allowMultiple: true, handleNotFoundStyleName: 'log'});
