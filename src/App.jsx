const React = require('react');
const CSS = require('react-css-modules');
const styles = require('./App.pcss');

class App extends React.Component {
	render() {
		return <div styleName="app"/>;
	}
}

module.exports = CSS(App, styles);
