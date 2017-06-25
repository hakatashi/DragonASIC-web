const React = require('react');
const CSS = require('react-css-modules');
const Hammer = require('react-hammerjs');
const styles = require('./App.pcss');
const Module = require('./Module.jsx');

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			modules: [],
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

	render() {
		return (
			<Hammer onDoubleTap={this.handleDoubleTap}>
				<div styleName="app">
					{this.state.modules.map((module) => (
						<Module
							key={module.uid}
							initialX={module.initialX}
							initialY={module.initialY}
							onPan={this.handlePanModule}
						/>
					))}
				</div>
			</Hammer>
		);
	}
}

module.exports = CSS(App, styles, {allowMultiple: true});
