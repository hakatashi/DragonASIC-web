const React = require('react');
const ReactDOM = require('react-dom');

const rootStyle = require('!!style-loader?sourceMap!css-loader!postcss-loader?sourceMap!./index.pcss');

const reactRoot = document.querySelector('.app');

ReactDOM.render(<div/>, reactRoot);
