const React = require('react');
const CSS = require('react-css-modules');
const {default: AceEditor} = require('react-ace');
const styles = require('./App.pcss');

require('brace/mode/c_cpp');
require('brace/theme/monokai');

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			modules: [],
			wires: [],
			activeKnob: null,
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

	handleKnobMouseEnter = (knob) => {
		this.setState({
			activeKnob: knob,
		});
	}

	handleKnobMouseLeave = () => {
		this.setState({
			activeKnob: null,
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
			<div styleName="app">
				<div styleName="info-area">
					<div styleName="head">Serial Output</div>
				</div>
				<div styleName="editor-area">
					<AceEditor
						mode="c_cpp"
						theme="monokai"
						name="editor"
						width="100%"
						height="100%"
					/>
				</div>
				<div styleName="sensor-area">
					<div styleName="head">Sensors</div>
				</div>
			</div>
		);
	}
}

module.exports = CSS(App, styles, {allowMultiple: true});
