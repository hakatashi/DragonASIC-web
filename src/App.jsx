const React = require('react');
const CSS = require('react-css-modules');
const {default: AceEditor} = require('react-ace');
const {stripIndent} = require('common-tags');
const InfoArea = require('./InfoArea.jsx');
const styles = require('./App.pcss');

require('brace/mode/c_cpp');
require('brace/theme/monokai');

class App extends React.Component {
	constructor() {
		super();

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
			<div styleName="app">
				<InfoArea/>
				<div styleName="editor-area">
					<AceEditor
						mode="c_cpp"
						theme="monokai"
						name="editor"
						width="100%"
						height="100%"
						value={stripIndent`
							#include <stdio.h>

							int main(int argc, char *argv[]) {
								printf("Hello, World!\\n");
								return 0;
							}
						`}
					/>
				</div>
				<div styleName="sensor-area">
					<div styleName="head">Sensors</div>
				</div>
			</div>
		);
	}
}

module.exports = CSS(App, styles, {allowMultiple: true, handleNotFoundStyleName: 'log'});
