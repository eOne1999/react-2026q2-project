import { Component } from 'react';
import Card from '../Card/Card';

interface Pokemon {
  name: string;
  types: string;
}

interface CardListProps {
  items: Pokemon[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { items } = this.props;

    if (items.length === 0) {
      return <p>No results found.</p>;
    }

    return (
      <div className="card-list">
        {items.map((pokemon) => (
          <Card key={pokemon.name} name={pokemon.name} types={pokemon.types} />
        ))}
      </div>
    );
  }
}

export default CardList;
