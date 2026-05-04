import { Component } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

interface SearchState {
  inputValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    const savedTerm = localStorage.getItem('searchTerm') ?? '';
    this.state = {
      inputValue: savedTerm,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.inputValue.trim();
    const saved = localStorage.getItem('searchTerm') ?? '';

    if (trimmed === saved) return;

    localStorage.setItem('searchTerm', trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div className="search">
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Search Pokémon..."
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default Search;
