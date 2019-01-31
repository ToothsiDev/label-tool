import React, { Component } from 'react';
import { Grid, Header, List, Label, Icon } from 'semantic-ui-react';
import Hotkeys from 'react-hot-keys';
import update from 'immutability-helper';

import 'semantic-ui-css/semantic.min.css';

import Canvas from './Canvas';
import './App.css';

const shortcuts = '1234567890qwe';
const colors = [
  'red',
  'blue',
  'green',
  'violet',
  'orange',
  'brown',
  'yellow',
  'olive',
  'teal',
  'purple',
  'pink',
  'grey',
  'black',
];
const labels = ['cat', 'dog', 'car', 'tree', 'another one'];

function ListItem({
  shortcut,
  label,
  onSelect,
  onToggle,
  color,
  selected = false,
  isToggled,
}) {
  const icon = onToggle ? (
    <Icon
      link
      name={isToggled ? 'eye' : 'eye slash'}
      style={{ float: 'right' }}
      onClick={e => {
        onToggle(label);
        e.stopPropagation();
      }}
    />
  ) : null;

  return (
    <List.Item onClick={onSelect} active={selected} key={label}>
      <Hotkeys keyName={shortcut} onKeyDown={onSelect}>
        <Label color={color} horizontal>
          {shortcut}
        </Label>
        {label}
        {icon}
      </Hotkeys>
    </List.Item>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      polygons: {}, // mapping from label name to a list of polygon structures
      toggles: {},
      reassigning: false,
    };
    labels.map(label => (this.state.polygons[label] = []));
    labels.map(label => (this.state.toggles[label] = true));

    this.handleChange = this.handleChange.bind(this);
    this.canvasRef = React.createRef();
  }

  handleChange(eventType, figure) {
    const label = labels[colors.indexOf(figure.color)];
    const { polygons } = this.state;
    const idx = polygons[label].findIndex(f => f.id === figure.id);

    switch (eventType) {
      case 'new':
        this.setState(state => ({
          polygons: update(state.polygons, {
            [label]: {
              $push: [{ id: figure.id || genId(), points: figure.points }],
            },
          }),
          selected: null, // deselect the label after the figure is finished
        }));
        break;

      case 'replace':
        this.setState(state => ({
          polygons: update(state.polygons, {
            [label]: {
              $splice: [[idx, 1, { id: figure.id, points: figure.points }]],
            },
          }),
        }));
        break;

      case 'delete':
        this.setState(state => ({
          polygons: update(state.polygons, {
            [label]: {
              $splice: [[idx, 1]],
            },
          }),
        }));
        break;
    }
  }

  render() {
    const { polygons, selected, reassigning, toggles } = this.state;
    const figures = [];
    labels.map((label, i) =>
      polygons[label].map(
        poly =>
          toggles[label] &&
          figures.push({ color: colors[i], points: poly.points, id: poly.id })
      )
    );

    const sidebarProps = reassigning
      ? {
          title: 'Select the new label',
          selected: null,
          onSelect: selected => {
            const figure = this.canvasRef.current.getSelectedFigure();
            const newColor = colors[labels.indexOf(selected)];
            if (figure && figure.color !== newColor) {
              this.handleChange('delete', figure);
              figure.color = newColor;
              this.handleChange('new', figure);
            }

            this.setState({ reassigning: false });
          },
        }
      : {
          title: 'Labeling',
          selected,
          onSelect: selected => this.setState({ selected }),
          toggles,
          onToggle: label =>
            this.setState({
              toggles: update(toggles, { [label]: { $set: !toggles[label] } }),
            }),
        };

    return (
      <Grid columns={3} divided stretched style={{ margin: 0 }}>
        <Grid.Row stretched style={{ padding: 0 }}>
          <Grid.Column width={4} style={{ overflow: 'auto' }}>
            <Sidebar labels={labels} {...sidebarProps} />
          </Grid.Column>
          <Grid.Column width={12} style={{ padding: 0 }}>
            <Canvas
              url="http://kempe.net/images/newspaper-big.jpg"
              figures={figures}
              color={selected ? colors[labels.indexOf(selected)] : null}
              onChange={this.handleChange}
              onReassignment={() => this.setState({ reassigning: true })}
              ref={this.canvasRef}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class Sidebar extends Component {
  render() {
    const { title, onSelect, labels, selected, toggles, onToggle } = this.props;
    return (
      <div style={{ padding: '1em 0' }}>
        <Header size="large" align="center">
          {title}
        </Header>
        <List divided selection>
          {labels.map((label, i) =>
            ListItem({
              shortcut: shortcuts[i],
              label,
              color: colors[i],
              onSelect: () => onSelect(label),
              selected: selected === label,
              onToggle: onToggle,
              isToggled: toggles && toggles[label],
            })
          )}
          <Hotkeys keyName="esc" onKeyDown={() => onSelect(null)} />
        </List>
      </div>
    );
  }
}

function genId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export default App;
