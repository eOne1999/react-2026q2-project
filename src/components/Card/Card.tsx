import { Component } from 'react';

interface CardProps {
  name: string;
  types: string;
}

class Card extends Component<CardProps> {
  render() {
    const { name, types } = this.props;
    return (
      <div className="card">
        <h3>{name}</h3>
        <p>{types}</p>
      </div>
    );
  }
}

export default Card;
