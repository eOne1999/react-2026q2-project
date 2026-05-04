import { Component } from 'react';
import Search from './components/Search/Search';
import CardList from './components/CardList/CardList';
import Spinner from './components/Spinner/Spinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

interface Pokemon {
  name: string;
  types: string;
}

interface AppState {
  items: Pokemon[];
  isLoading: boolean;
  error: string | null;
  throwError: boolean;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      items: [],
      isLoading: false,
      error: null,
      throwError: false,
    };
  }

  async fetchPokemon(term: string) {
    this.setState({ isLoading: true, error: null });

    try {
      if (term) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        const types = data.types
          .map((t: { type: { name: string } }) => t.type.name)
          .join(', ');
        this.setState({ items: [{ name: data.name, types }] });
      } else {
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        const detailedItems = await Promise.all(
          data.results.map(async (p: { name: string }) => {
            const detailResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${p.name}`
            );
            const detail = await detailResponse.json();
            const types = detail.types
              .map((t: { type: { name: string } }) => t.type.name)
              .join(', ');
            return { name: p.name, types };
          })
        );
        this.setState({ items: detailedItems });
      }
    } catch (err) {
      if (err instanceof Error) {
        this.setState({ error: err.message });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    const savedTerm = localStorage.getItem('searchTerm') ?? '';
    this.fetchPokemon(savedTerm);
  }

  handleSearch = (term: string) => {
    this.fetchPokemon(term);
  };

  handleThrowError = () => {
    this.setState({ throwError: true });
  };

  handleReset = () => {
    this.setState({ throwError: false });
  };

  render() {
    const { items, isLoading, error, throwError } = this.state;

    return (
      <ErrorBoundary onReset={this.handleReset}>
        <ErrorThrower shouldThrow={throwError} />
        <div className="app">
          <section className="search-section">
            <Search onSearch={this.handleSearch} />
          </section>
          <section className="results-section">
            {isLoading && <Spinner />}
            {error && <p className="error">{error}</p>}
            {!isLoading && !error && <CardList items={items} />}
          </section>
          <button className="error-button" onClick={this.handleThrowError}>
            Throw Error
          </button>
        </div>
      </ErrorBoundary>
    );
  }
}

class ErrorThrower extends Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Test error');
    }
    return null;
  }
}

export default App;
